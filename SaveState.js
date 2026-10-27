var SaveGameVersion = "Remake1";	// bumped for remake (old saves will not load)
var SaveChapter = "";
var SaveScreen = "";
var SaveMaxSlot = 9;

// Opens the save menu for a specific chapter
function SaveMenu(NextChapter, NextScreen) {
	SaveChapter = NextChapter;
	SaveScreen = NextScreen;
	SetScene("C999_Common", "GameSave");
}

// Returns the save state summary
function SaveStateGetSummary(SlotNumber) {

	var SN = SlotNumber.toString();
	var Summary = "@" + GetText("NoSaveOnSlot") + " " + SN;
	if (localStorage.getItem("SaveGameVersion" + SN))
		if (localStorage.getItem("SaveGameVersion" + SN) == SaveGameVersion) {
			var SaveStatePlayerName = localStorage.getItem("Common_PlayerName" + SN);
			var SaveStateDay = localStorage.getItem("CurrentDay" + SN);
			var SaveStateDateTime = localStorage.getItem("SaveGameDateTime" + SN);
			if (SaveStateDay == null) SaveStateDay = "?";
			Summary = "@" + SaveStatePlayerName.substr(0, 10) + " - Day " + SaveStateDay + "|" + SaveStateDateTime;
		}

	return Summary;

}

// Show some info on the slots to load or save
function SaveStateSlotSummary() {

	if ((CurrentStage != null) && (CurrentText != null))
		if (CurrentStage[1][StageInteractionText] == "@Slot 1") {

			var Slot = 1;
			while (Slot <= SaveMaxSlot) {
				CurrentStage[Slot][StageInteractionText] = SaveStateGetSummary(Slot);
				Slot++;
			}

		}

}

// Save the game state on a specific slot
function SaveState(SlotNumber) {

	var SN = SlotNumber.toString();
	localStorage.setItem("SaveGameVersion" + SN, SaveGameVersion);
	localStorage.setItem("SaveGameDateTime" + SN, GetFormatDate());
	localStorage.setItem("CurrentChapter" + SN, SaveChapter);
	localStorage.setItem("CurrentScreen" + SN, SaveScreen);
	localStorage.setItem("Common_PlayerName" + SN, Common_PlayerName);
	localStorage.setItem("Common_PlayerOwner" + SN, Common_PlayerOwner);
	localStorage.setItem("Common_PlayerLover" + SN, Common_PlayerLover);
	localStorage.setItem("Common_PlayerCloth" + SN, Common_PlayerCloth);
	localStorage.setItem("PlayerInventory" + SN, JSON.stringify(PlayerInventory));
	localStorage.setItem("PlayerLockedInventory" + SN, JSON.stringify(PlayerLockedInventory));
	localStorage.setItem("PlayerSkill" + SN, JSON.stringify(PlayerSkill));
	localStorage.setItem("Actor" + SN, JSON.stringify(Actor));
	localStorage.setItem("GameLog" + SN, JSON.stringify(GameLog));
	localStorage.setItem("CurrentTime" + SN, CurrentTime.toString());

	// Remake: day system + new player flags
	localStorage.setItem("CurrentDay" + SN, CurrentDay.toString());
	localStorage.setItem("CurrentMinute" + SN, CurrentMinute.toString());
	localStorage.setItem("Common_PlayerSedated" + SN, Common_PlayerSedated ? "1" : "0");
	localStorage.setItem("Common_PlayerOwned" + SN, Common_PlayerOwned ? "1" : "0");
	localStorage.setItem("Common_PlayerBroken" + SN, Common_PlayerBroken ? "1" : "0");
	localStorage.setItem("Common_PlayerForSale" + SN, Common_PlayerForSale ? "1" : "0");
	localStorage.setItem("Common_PlayerInCage" + SN, Common_PlayerInCage ? "1" : "0");
	localStorage.setItem("Common_PlayerEscaped" + SN, Common_PlayerEscaped ? "1" : "0");

	// Reload the summaries
	CurrentStage[1][StageInteractionText] = "@Slot 1";
	SaveStateSlotSummary();

}

// Load the game state on a specific slot
function LoadState(SlotNumber) {

	var SN = SlotNumber.toString();
	if (localStorage.getItem("SaveGameVersion" + SN))
		if (localStorage.getItem("SaveGameVersion" + SN) == SaveGameVersion) {

			// Core state
			CurrentChapter = localStorage.getItem("CurrentChapter" + SN);
			CurrentScreen = localStorage.getItem("CurrentScreen" + SN);
			Common_PlayerName = localStorage.getItem("Common_PlayerName" + SN);
			Common_PlayerOwner = localStorage.getItem("Common_PlayerOwner" + SN);
			Common_PlayerLover = localStorage.getItem("Common_PlayerLover" + SN);
			PlayerInventory = JSON.parse(localStorage.getItem("PlayerInventory" + SN));
			PlayerLockedInventory = JSON.parse(localStorage.getItem("PlayerLockedInventory" + SN));
			Actor = JSON.parse(localStorage.getItem("Actor" + SN));
			GameLog = JSON.parse(localStorage.getItem("GameLog" + SN));
			PlayerSkill = JSON.parse(localStorage.getItem("PlayerSkill" + SN));
			CurrentTime = parseFloat(localStorage.getItem("CurrentTime" + SN));

			if (Common_PlayerOwner == null) Common_PlayerOwner = "";
			if (Common_PlayerLover == null) Common_PlayerLover = "";

			// Clothes
			Common_PlayerCloth = localStorage.getItem("Common_PlayerCloth" + SN);
			if (Common_PlayerCloth == null) Common_PlayerCloth = "Clothed";
			PlayerClothes(Common_PlayerCloth);

			// Remake: day system
			CurrentDay = parseInt(localStorage.getItem("CurrentDay" + SN));
			if (isNaN(CurrentDay) || CurrentDay < 1) CurrentDay = 1;
			CurrentMinute = parseInt(localStorage.getItem("CurrentMinute" + SN));
			if (isNaN(CurrentMinute)) CurrentMinute = 450;	// 07:30 default

			// Remake: player flags
			Common_PlayerSedated = (localStorage.getItem("Common_PlayerSedated" + SN) == "1");
			Common_PlayerOwned = (localStorage.getItem("Common_PlayerOwned" + SN) == "1");
			Common_PlayerBroken = (localStorage.getItem("Common_PlayerBroken" + SN) == "1");
			Common_PlayerForSale = (localStorage.getItem("Common_PlayerForSale" + SN) == "1");
			Common_PlayerInCage = (localStorage.getItem("Common_PlayerInCage" + SN) == "1");
			Common_PlayerEscaped = (localStorage.getItem("Common_PlayerEscaped" + SN) == "1");

			// Ensure actor arrays are wide enough (Love, Sub, Inv, Orgasm, Bondage, LastChapter, Cloth, Pose, HideName, Owner, Status)
			for (var A = 0; A < Actor.length; A++) {
				while (Actor[A].length < 12)
					Actor[A].push(Actor[A].length === 11 ? [] : (Actor[A].length === 9 ? false : (Actor[A].length === 10 ? "" : "")));
				// Guarantee Status is an array
				if (!Array.isArray(Actor[A][11])) Actor[A][11] = [];
			}

			// Ensure game log width
			for (var L = 0; L < GameLog.length; L++)
				if (GameLog[L].length < 4)
					GameLog[L] = [GameLog[L][0], GameLog[L][1], GameLog[L][2], 0];

			// Start the game
			LoadRestrainStatus();
			SetScene(CurrentChapter, CurrentScreen);

		}

}
