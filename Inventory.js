var PlayerInventory = [];
var PlayerInventoryName = 0;
var PlayerInventoryQuantity = 1;
var PlayerLockedInventory = [];
var PlayerSavedInventory = [];
var PlayerInventoryTab = 0;
var PlayerInventoryScroll = 0; // arrow scroll offset for top bar
var PlayerInventoryVisible = 12; // icons visible between arrows

// Items the current scene allows the player to USE right now (left floating icons)
// Chapters can set: PlayerUsableItems = ["Rope", "CuffsKey", ...];
// Or leave empty and GetUsableInventoryItems() will auto-detect common cases.
var PlayerUsableItems = [];

// Set up the player clothes or costume
function PlayerClothes(NewCloth) {
	if ((NewCloth != "Clothed") && (NewCloth != "Underwear") && (NewCloth != "Naked")) Common_PlayerCostume = NewCloth;
	else Common_PlayerCostume = "";
	Common_PlayerCloth = NewCloth;
	Common_PlayerUnderwear = (NewCloth == "Underwear");
	Common_PlayerNaked = (NewCloth == "Naked");
	Common_PlayerClothed = (!Common_PlayerUnderwear && !Common_PlayerNaked);
}

// Set the restrained / gagged / blinded / chaste common variables
function LoadRestrainStatus() {
	Common_PlayerRestrained = (
		PlayerHasLockedInventory("Cuffs") ||
		PlayerHasLockedInventory("Rope") ||
		PlayerHasLockedInventory("Armbinder") ||
		PlayerHasLockedInventory("Manacles") ||
		PlayerHasLockedInventory("Hogtie") ||
		PlayerHasLockedInventory("SpreaderBar") ||
		PlayerHasLockedInventory("Straitjacket") ||
		PlayerHasLockedInventory("Chain") ||
		PlayerHasLockedInventory("Mitts")
	);
	Common_PlayerGagged = (
		PlayerHasLockedInventory("BallGag") ||
		PlayerHasLockedInventory("TapeGag") ||
		PlayerHasLockedInventory("ClothGag") ||
		PlayerHasLockedInventory("PantieGag") ||
		PlayerHasLockedInventory("SockGag") ||
		PlayerHasLockedInventory("DoubleOpenGag") ||
		PlayerHasLockedInventory("RingGag") ||
		PlayerHasLockedInventory("BitGag") ||
		PlayerHasLockedInventory("PanelGag") ||
		PlayerHasLockedInventory("MuzzleGag") ||
		PlayerHasLockedInventory("InflatableGag")
	);
	Common_PlayerBlinded = (
		PlayerHasLockedInventory("Blindfold") ||
		PlayerHasLockedInventory("Hood") ||
		PlayerHasLockedInventory("HoodOpenMouth")
	);
	Common_PlayerChaste = PlayerHasLockedInventory("ChastityBelt");
	Common_PlayerNotRestrained = !Common_PlayerRestrained;
	Common_PlayerNotGagged = !Common_PlayerGagged;
	Common_PlayerNotBlinded = !Common_PlayerBlinded;
}

// Save the current full inventory for the player
function PlayerSaveAllInventory() {
	PlayerSavedInventory = PlayerInventory.slice();
}

// Restore the full saved inventory for the player, one item by item
function PlayerRestoreAllInventory() {
	for (var I = 0; I < PlayerSavedInventory.length; I++)
		PlayerAddInventory(PlayerSavedInventory[I][PlayerInventoryName], PlayerSavedInventory[I][PlayerInventoryQuantity]);
	PlayerSavedInventory = [];
}

// Add a new item to the locked inventory
function PlayerLockInventory(NewInventory) {

	// Check if the item is already locked before adding it
	for (var I = 0; I < PlayerLockedInventory.length; I++)
		if (PlayerLockedInventory[I] == NewInventory)
			return;
	PlayerLockedInventory.push(NewInventory);
	LoadRestrainStatus();

	// If there's rope/armbinder and a costume, we strip the player
	if (((NewInventory == "Rope") || (NewInventory == "Armbinder") || (NewInventory == "Hogtie") || (NewInventory == "Straitjacket")) && (Common_PlayerCostume != "") && (Common_PlayerCostume != "BlackDress") && (Common_PlayerCostume != "WhiteLingerie") && (Common_PlayerCostume != "RedBikini"))
		PlayerClothes("Underwear");

}

// Remove an item from the locked inventory
function PlayerUnlockInventory(UnlockedInventory) {

	for (var I = 0; I < PlayerLockedInventory.length; I++)
		if (PlayerLockedInventory[I] == UnlockedInventory)
			PlayerLockedInventory.splice(I, 1);
	LoadRestrainStatus();

}

// Remove all items from the locked inventory except egg, plug, collars, chastity, brand
function PlayerUnlockAllInventory() {
	var HadCollar = PlayerHasLockedInventory("Collar");
	var HadPermanentCollar = PlayerHasLockedInventory("PermanentCollar");
	var HadPadlockedCollar = PlayerHasLockedInventory("PadlockedCollar");
	var HadEgg = PlayerHasLockedInventory("VibratingEgg");
	var HadPlug = PlayerHasLockedInventory("ButtPlug");
	var HadBelt = PlayerHasLockedInventory("ChastityBelt");
	var HadBrand = PlayerHasLockedInventory("Brand");
	var HadTag = PlayerHasLockedInventory("OwnershipTag");
	while (PlayerLockedInventory.length > 0)
		PlayerLockedInventory.splice(0, 1);
	if (HadCollar) PlayerLockInventory("Collar");
	if (HadPermanentCollar) PlayerLockInventory("PermanentCollar");
	if (HadPadlockedCollar) PlayerLockInventory("PadlockedCollar");
	if (HadEgg) PlayerLockInventory("VibratingEgg");
	if (HadPlug) PlayerLockInventory("ButtPlug");
	if (HadBelt) PlayerLockInventory("ChastityBelt");
	if (HadBrand) PlayerLockInventory("Brand");
	if (HadTag) PlayerLockInventory("OwnershipTag");
	LoadRestrainStatus();
}

// Returns true if the player has the locked inventory
function PlayerHasLockedInventory(QueryInventory) {

	for (var I = 0; I < PlayerLockedInventory.length; I++)
		if (QueryInventory == PlayerLockedInventory[I])
			return true;
	return false;

}

// Add a new item to the inventory if it's not already there
function PlayerAddInventory(NewInventory, NewQuantity) {
	// Permanent inventory: once obtained, you keep it (no stack of uses)
	for (var I = 0; I < PlayerInventory.length; I++)
		if (NewInventory == PlayerInventory[I][PlayerInventoryName]) {
			PlayerInventory[I][PlayerInventoryQuantity] = 1;
			return;
		}
	PlayerInventory[PlayerInventory.length] = [NewInventory, 1];
}

// Remove an item from the player inventory
function PlayerRemoveInventory(RemInventory, RemQuantity) {
	// Items are permanent — obtaining means you keep them.
	// This function no longer deletes from the bag.
	// (Body locks still use PlayerUnlockInventory / PlayerLockInventory.)
	return;
}

// Remove all inventory from the player
function PlayerRemoveAllInventory() {
	while (PlayerInventory.length > 0)
		PlayerInventory.splice(0, 1);
}

// Remove half of the inventory from the player (rounded up)
function PlayerRemoveHalfInventory() {
	for (var I = 0; I < PlayerInventory.length; I++) {
		if (PlayerInventory[I][PlayerInventoryQuantity] <= 1) {
			PlayerInventory.splice(I, 1);
			I--;
		} else PlayerInventory[I][PlayerInventoryQuantity] = Math.floor(PlayerInventory[I][PlayerInventoryQuantity] / 2);
	}
}

// Returns true if the player has the queried inventory
function PlayerHasInventory(QueryInventory) {

	for (var I = 0; I < PlayerInventory.length; I++)
		if (QueryInventory == PlayerInventory[I][PlayerInventoryName])
			return true;
	return false;

}

// Pick a random restrain and applies it on the player
function PlayerRandomRestrain() {

	var R = "";
	if (!Common_PlayerRestrained) {
		var RT = [];
		if (PlayerHasInventory("Rope")) RT.push("Rope");
		if (PlayerHasInventory("Cuffs")) RT.push("Cuffs");
		if (PlayerHasInventory("Armbinder")) RT.push("Armbinder");
		if (PlayerHasInventory("Manacles")) RT.push("Manacles");
		if (PlayerHasInventory("Hogtie")) RT.push("Hogtie");
		if (PlayerHasInventory("SpreaderBar")) RT.push("SpreaderBar");
		if (PlayerHasInventory("Straitjacket")) RT.push("Straitjacket");
		if (PlayerHasInventory("Chain")) RT.push("Chain");
		if (PlayerHasInventory("Mitts")) RT.push("Mitts");
		if (RT.length > 0) R = RT[Math.floor(Math.random() * RT.length)];
	}

	if (R != "") { PlayerRemoveInventory(R, 1); PlayerLockInventory(R); }

}

// Pick a random gag and applies it on the player
function PlayerRandomGag() {

	var G = "";
	if (!Common_PlayerGagged) {
		var GT = [];
		if (PlayerHasInventory("BallGag")) GT.push("BallGag");
		if (PlayerHasInventory("TapeGag")) GT.push("TapeGag");
		if (PlayerHasInventory("ClothGag")) GT.push("ClothGag");
		if (PlayerHasInventory("RingGag")) GT.push("RingGag");
		if (PlayerHasInventory("BitGag")) GT.push("BitGag");
		if (PlayerHasInventory("PanelGag")) GT.push("PanelGag");
		if (PlayerHasInventory("MuzzleGag")) GT.push("MuzzleGag");
		if (PlayerHasInventory("InflatableGag")) GT.push("InflatableGag");
		if (GT.length > 0) G = GT[Math.floor(Math.random() * GT.length)];
	}

	if (G != "") { PlayerRemoveInventory(G, 1); PlayerLockInventory(G); }

}

// Restrains the player randomly from her own inventory
function PlayerRandomBondage() {
	PlayerRandomRestrain();
	PlayerRandomGag();
}

// Release the player from bondage and restore inventory
function PlayerReleaseBondage() {
	if (PlayerHasLockedInventory("Cuffs")) { PlayerUnlockInventory("Cuffs"); PlayerAddInventory("Cuffs", 1); }
	if (PlayerHasLockedInventory("Rope")) { PlayerUnlockInventory("Rope"); PlayerAddInventory("Rope", 1); }
	if (PlayerHasLockedInventory("Armbinder")) { PlayerUnlockInventory("Armbinder"); PlayerAddInventory("Armbinder", 1); }
	if (PlayerHasLockedInventory("Manacles")) { PlayerUnlockInventory("Manacles"); PlayerAddInventory("Manacles", 1); }
	if (PlayerHasLockedInventory("Hogtie")) { PlayerUnlockInventory("Hogtie"); PlayerAddInventory("Rope", 1); }
	if (PlayerHasLockedInventory("SpreaderBar")) { PlayerUnlockInventory("SpreaderBar"); PlayerAddInventory("SpreaderBar", 1); }
	if (PlayerHasLockedInventory("Straitjacket")) { PlayerUnlockInventory("Straitjacket"); PlayerAddInventory("Straitjacket", 1); }
	if (PlayerHasLockedInventory("Chain")) { PlayerUnlockInventory("Chain"); PlayerAddInventory("Chain", 1); }
	if (PlayerHasLockedInventory("Mitts")) { PlayerUnlockInventory("Mitts"); PlayerAddInventory("Mitts", 1); }
	PlayerUngag();
	PlayerUnblindfold();
}

// Ungag the player and restore inventory
function PlayerUngag() {
	if (PlayerHasLockedInventory("BallGag")) { PlayerUnlockInventory("BallGag"); PlayerAddInventory("BallGag", 1); }
	if (PlayerHasLockedInventory("ClothGag")) { PlayerUnlockInventory("ClothGag"); PlayerAddInventory("ClothGag", 1); }
	if (PlayerHasLockedInventory("TapeGag")) { PlayerUnlockInventory("TapeGag"); }
	if (PlayerHasLockedInventory("PantieGag")) { PlayerUnlockInventory("PantieGag"); PlayerAddInventory("PantieGag", 1); }
	if (PlayerHasLockedInventory("SockGag")) { PlayerUnlockInventory("SockGag"); PlayerAddInventory("SockGag", 1); }
	if (PlayerHasLockedInventory("DoubleOpenGag")) { PlayerUnlockInventory("DoubleOpenGag"); PlayerAddInventory("DoubleOpenGag", 1); }
	if (PlayerHasLockedInventory("RingGag")) { PlayerUnlockInventory("RingGag"); PlayerAddInventory("RingGag", 1); }
	if (PlayerHasLockedInventory("BitGag")) { PlayerUnlockInventory("BitGag"); PlayerAddInventory("BitGag", 1); }
	if (PlayerHasLockedInventory("PanelGag")) { PlayerUnlockInventory("PanelGag"); PlayerAddInventory("PanelGag", 1); }
	if (PlayerHasLockedInventory("MuzzleGag")) { PlayerUnlockInventory("MuzzleGag"); PlayerAddInventory("MuzzleGag", 1); }
	if (PlayerHasLockedInventory("InflatableGag")) { PlayerUnlockInventory("InflatableGag"); PlayerAddInventory("InflatableGag", 1); }
}

// Remove blindfold / hood and restore inventory
function PlayerUnblindfold() {
	if (PlayerHasLockedInventory("Blindfold")) { PlayerUnlockInventory("Blindfold"); PlayerAddInventory("Blindfold", 1); }
	if (PlayerHasLockedInventory("Hood")) { PlayerUnlockInventory("Hood"); PlayerAddInventory("Hood", 1); }
	if (PlayerHasLockedInventory("HoodOpenMouth")) { PlayerUnlockInventory("HoodOpenMouth"); PlayerAddInventory("HoodOpenMouth", 1); }
}

// Add a random item in the player inventory
function PlayerAddRandomItem() {
	var ItemList = [
		"BallGag", "TapeGag", "ClothGag", "RingGag", "BitGag",
		"Cuffs", "Rope", "Armbinder", "Manacles",
		"ChastityBelt", "VibratingEgg", "ButtPlug",
		"Crop", "Collar", "Blindfold", "SleepingPill",
		"SpreaderBar", "Mitts", "NippleClamps"
	];
	var Item = ItemList[Math.floor(Math.random() * ItemList.length)];
	PlayerAddInventory(Item, 1);
	if (Item == "TapeGag") PlayerAddInventory(Item, 7);
	if ((Item == "Cuffs") && (Math.floor(Math.random() * 2) == 1)) PlayerAddInventory("CuffsKey", 1);
}

// Returns the total quantity of items that the player has
function PlayerInventoryTotalQuantity() {
	var TotalQuantity = 0;
	for (var I = 0; I < PlayerInventory.length; I++)
		TotalQuantity = TotalQuantity + PlayerInventory[I][PlayerInventoryQuantity];
	return TotalQuantity;
}

// Auto-detect items that make sense to use in the current context
function GetUsableInventoryItems() {
	// Explicit list from the chapter wins
	if (PlayerUsableItems && PlayerUsableItems.length > 0) {
		var out = [];
		for (var i = 0; i < PlayerUsableItems.length; i++)
			if (PlayerHasInventory(PlayerUsableItems[i]) || PlayerHasLockedInventory(PlayerUsableItems[i]))
				out.push(PlayerUsableItems[i]);
		return out;
	}

	// Auto: common usable tools when an actor is present and player is free
	var usable = [];
	if (typeof CurrentActor !== "undefined" && CurrentActor != "" && !Common_PlayerRestrained) {
		if (PlayerHasInventory("Rope") && typeof ActorIsRestrained === "function" && !ActorIsRestrained())
			usable.push("Rope");
		if (PlayerHasInventory("Cuffs") && typeof ActorIsRestrained === "function" && !ActorIsRestrained())
			usable.push("Cuffs");
		if (PlayerHasInventory("BallGag") && typeof ActorIsGagged === "function" && !ActorIsGagged())
			usable.push("BallGag");
		if (PlayerHasInventory("ClothGag") && typeof ActorIsGagged === "function" && !ActorIsGagged())
			usable.push("ClothGag");
		if (PlayerHasInventory("Blindfold") && typeof ActorIsBlindfolded === "function" && !ActorIsBlindfolded())
			usable.push("Blindfold");
		if (PlayerHasInventory("Collar") && typeof ActorHasInventory === "function" && !ActorHasInventory("Collar"))
			usable.push("Collar");
		if (PlayerHasInventory("CuffsKey") && typeof ActorHasInventory === "function" && (ActorHasInventory("Cuffs") || ActorHasInventory("Manacles")))
			usable.push("CuffsKey");
		if (PlayerHasInventory("Chloroform"))
			usable.push("Chloroform");
		if (PlayerHasInventory("SleepingPill"))
			usable.push("SleepingPill");
		if (PlayerHasInventory("Knife"))
			usable.push("Knife");
	}
	// Player can always try to use key on self if cuffed
	if (PlayerHasInventory("CuffsKey") && (PlayerHasLockedInventory("Cuffs") || PlayerHasLockedInventory("Manacles")))
		if (usable.indexOf("CuffsKey") < 0) usable.push("CuffsKey");
	return usable;
}

// Returns the name of the inventory item that was clicked (top bar OR left usable icons)
function GetClickedInventory() {

	var Inv = "";

	// --- Left floating usable icons ---
	var usable = GetUsableInventoryItems();
	var leftX = 12;
	var leftTop = (typeof UI_TOP_H !== "undefined" ? UI_TOP_H : 100) + 20;
	var icon = (typeof UI_ICON !== "undefined" ? UI_ICON : 90);
	var gap = 12;
	if ((MouseX >= leftX) && (MouseX <= leftX + icon + 10)) {
		for (var u = 0; u < usable.length && u < 8; u++) {
			var uy = leftTop + u * (icon + gap);
			if ((MouseY >= uy) && (MouseY <= uy + icon))
				return usable[u];
		}
	}

	// --- Top collection bar ---
	if (!((MouseY >= 0) && (MouseY <= UI_TOP_H) && (MouseX <= UI_W - 120))) return Inv;

	// Left arrow
	if ((MouseX >= 4) && (MouseX <= 4 + UI_ICON)) {
		if (PlayerInventoryScroll > 0) PlayerInventoryScroll--;
		return "";
	}

	// Build display list: inventory + locked-only items
	var display = [];
	for (var I = 0; I < PlayerInventory.length; I++)
		display.push({ name: PlayerInventory[I][PlayerInventoryName], locked: PlayerHasLockedInventory(PlayerInventory[I][PlayerInventoryName]) });
	for (var L = 0; L < PlayerLockedInventory.length; L++)
		if (!PlayerHasInventory(PlayerLockedInventory[L]))
			display.push({ name: PlayerLockedInventory[L], locked: true });

	var maxScroll = Math.max(0, display.length - PlayerInventoryVisible);
	if (PlayerInventoryScroll > maxScroll) PlayerInventoryScroll = maxScroll;

	// Right arrow (after visible slots)
	var rightArrowX = 4 + (PlayerInventoryVisible + 1) * UI_ICON;
	if ((MouseX >= rightArrowX) && (MouseX <= rightArrowX + UI_ICON)) {
		if (PlayerInventoryScroll < maxScroll) PlayerInventoryScroll++;
		return "";
	}

	for (var i = 0; i < PlayerInventoryVisible; i++) {
		var idx = i + PlayerInventoryScroll;
		if (idx >= display.length) break;
		var slotX = 4 + (i + 1) * UI_ICON;
		if ((MouseX >= slotX) && (MouseX <= slotX + UI_ICON - 1)) {
			Inv = display[idx].locked && !PlayerHasInventory(display[idx].name) ? ("Locked_" + display[idx].name) : display[idx].name;
			break;
		}
	}

	return Inv;
}

function InventoryClick(Inv, LChapter, LScreen) {
	if (Inv != "") {
		SetScene("C999_Common", Inv.replace("Locked_", ""));
		LeaveChapter = LChapter;
		LeaveScreen = LScreen;
	}
}
