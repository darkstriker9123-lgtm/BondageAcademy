var C999_Common_GameSave_CurrentStage = 0;
var C999_Common_GameSave_ConfirmSlot = 0; // 0 none, >0 waiting confirm overwrite, <0 waiting confirm delete (-slot)

function C999_Common_GameSave_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	LeaveChapter = "C000_Intro";
	C999_Common_GameSave_ConfirmSlot = 0;
	if (typeof LoadInteractions === "function") LoadInteractions();
	if (typeof SaveStateSlotSummary === "function") SaveStateSlotSummary();
	if (typeof RunTimer !== "undefined") RunTimer = false;
}

function C999_Common_GameSave_SlotSummary(i) {
	var summary = "";
	try {
		if (typeof SaveStateGetSummary === "function") summary = SaveStateGetSummary(i) || "";
	} catch (e) {}
	if (summary && summary.charAt(0) == "@") summary = summary.substr(1);
	if (!summary) summary = (typeof GetText === "function" && GetText("NoSaveOnSlot")) ? GetText("NoSaveOnSlot") : "Empty";
	return summary;
}

function C999_Common_GameSave_SlotFilled(i) {
	try {
		return !!(localStorage.getItem("SaveGameVersion" + i));
	} catch (e) { return false; }
}

function C999_Common_GameSave_DrawSlotRow(i, y) {
	var x = 120, w = 1680, h = 78;
	var hover = (MouseX >= x && MouseX <= x + w - 200 && MouseY >= y && MouseY <= y + h);
	DrawRect(x, y, w - 200, h, hover ? "rgba(180,60,100,0.55)" : "rgba(20,12,28,0.72)");
	MainCanvas.strokeStyle = hover ? "rgba(255,200,220,0.9)" : "rgba(255,255,255,0.25)";
	MainCanvas.lineWidth = 2;
	MainCanvas.strokeRect(x, y, w - 200, h);
	MainCanvas.font = "28px Arial";
	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";
	MainCanvas.fillStyle = "#ffffff";
	var label = (typeof GetText === "function") ? (GetText("Slot") || "Slot") : "Slot";
	MainCanvas.fillText(label + " " + i + "  —  " + C999_Common_GameSave_SlotSummary(i), x + 24, y + h / 2);

	// Delete button (only if slot has data)
	if (C999_Common_GameSave_SlotFilled(i)) {
		var dx = x + w - 190, dw = 170;
		var dhov = (MouseX >= dx && MouseX <= dx + dw && MouseY >= y && MouseY <= y + h);
		DrawRect(dx, y, dw, h, dhov ? "rgba(160,40,40,0.85)" : "rgba(60,20,28,0.85)");
		MainCanvas.strokeStyle = dhov ? "#ffaaaa" : "rgba(255,255,255,0.3)";
		MainCanvas.strokeRect(dx, y, dw, h);
		MainCanvas.font = "26px Arial";
		MainCanvas.fillStyle = "#ffffff";
		MainCanvas.textAlign = "center";
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "删除" : "Delete", dx + dw / 2, y + h / 2);
	}
}

function C999_Common_GameSave_Run() {
	if (typeof DrawGetImage === "function" && typeof DrawImageReady === "function") {
		var bg = DrawGetImage(CurrentChapter + "/" + CurrentScreen + "/Save.jpg");
		if (DrawImageReady(bg)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/Save.jpg", 0, 0);
		else DrawRect(0, 0, 1920, 1280, "#1a1220");
	} else {
		DrawRect(0, 0, 1920, 1280, "#1a1220");
	}
	DrawRect(0, 0, 1920, 1280, "rgba(10,6,16,0.4)");

	MainCanvas.font = "48px Arial";
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";
	var title = (typeof GetText === "function") ? (GetText("SaveGame") || "Save Game") : "Save Game";
	MainCanvas.fillText(title, 960, 70);

	MainCanvas.font = "24px Arial";
	MainCanvas.fillStyle = "rgba(255,255,255,0.75)";
	MainCanvas.fillText(
		(CurrentLanguageTag == "CN")
			? "点击槽位保存（可覆盖）· 删除清除该槽"
			: "Click a slot to save (overwrites if filled) · Delete clears a slot",
		960, 118
	);

	// Confirm overlay
	if (C999_Common_GameSave_ConfirmSlot != 0) {
		var slot = Math.abs(C999_Common_GameSave_ConfirmSlot);
		var isDel = C999_Common_GameSave_ConfirmSlot < 0;
		DrawRect(360, 400, 1200, 360, "rgba(12,8,18,0.95)");
		MainCanvas.strokeStyle = "rgba(255,200,220,0.5)";
		MainCanvas.lineWidth = 2;
		MainCanvas.strokeRect(360, 400, 1200, 360);
		MainCanvas.font = "34px Arial";
		MainCanvas.fillStyle = "#ffffff";
		MainCanvas.textAlign = "center";
		var msg = isDel
			? ((CurrentLanguageTag == "CN") ? ("删除存档槽 " + slot + "？") : ("Delete save slot " + slot + "?"))
			: ((CurrentLanguageTag == "CN") ? ("覆盖存档槽 " + slot + "？") : ("Overwrite save slot " + slot + "?"));
		MainCanvas.fillText(msg, 960, 520);
		// Yes
		var yh = (MouseX >= 520 && MouseX <= 860 && MouseY >= 600 && MouseY <= 680);
		DrawRect(520, 600, 340, 80, yh ? "rgba(180,60,100,0.8)" : "rgba(40,24,48,0.9)");
		MainCanvas.strokeStyle = "#fff"; MainCanvas.strokeRect(520, 600, 340, 80);
		MainCanvas.font = "30px Arial";
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "确认" : "Confirm", 690, 640);
		// No
		var nh = (MouseX >= 1060 && MouseX <= 1400 && MouseY >= 600 && MouseY <= 680);
		DrawRect(1060, 600, 340, 80, nh ? "rgba(100,100,120,0.8)" : "rgba(40,24,48,0.9)");
		MainCanvas.strokeRect(1060, 600, 340, 80);
		MainCanvas.fillText((CurrentLanguageTag == "CN") ? "取消" : "Cancel", 1230, 640);
		return;
	}

	for (var i = 1; i <= 9; i++) {
		var y = 150 + (i - 1) * 84;
		C999_Common_GameSave_DrawSlotRow(i, y);
	}

	var cy = 150 + 9 * 84 + 16;
	var chov = (MouseX >= 600 && MouseX <= 1320 && MouseY >= cy && MouseY <= cy + 76);
	DrawRect(600, cy, 720, 76, chov ? "rgba(180,60,100,0.7)" : "rgba(40,24,48,0.85)");
	MainCanvas.strokeStyle = "#fff";
	MainCanvas.strokeRect(600, cy, 720, 76);
	MainCanvas.font = "32px Arial";
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.fillText((CurrentLanguageTag == "CN") ? "继续" : "Continue", 960, cy + 38);
}

function C999_Common_GameSave_Click() {
	// Confirm dialog
	if (C999_Common_GameSave_ConfirmSlot != 0) {
		var slot = Math.abs(C999_Common_GameSave_ConfirmSlot);
		var isDel = C999_Common_GameSave_ConfirmSlot < 0;
		if (MouseX >= 520 && MouseX <= 860 && MouseY >= 600 && MouseY <= 680) {
			if (isDel) C999_Common_GameSave_DeleteSlot(slot);
			else C999_Common_GameSave_SaveGame(slot);
			C999_Common_GameSave_ConfirmSlot = 0;
			return;
		}
		if (MouseX >= 1060 && MouseX <= 1400 && MouseY >= 600 && MouseY <= 680) {
			C999_Common_GameSave_ConfirmSlot = 0;
			return;
		}
		return;
	}

	for (var i = 1; i <= 9; i++) {
		var y = 150 + (i - 1) * 84;
		// Delete
		if (C999_Common_GameSave_SlotFilled(i) &&
			MouseX >= 120 + 1680 - 190 && MouseX <= 120 + 1680 - 20 &&
			MouseY >= y && MouseY <= y + 78) {
			C999_Common_GameSave_ConfirmSlot = -i;
			return;
		}
		// Save / overwrite
		if (MouseX >= 120 && MouseX <= 120 + 1680 - 200 && MouseY >= y && MouseY <= y + 78) {
			if (C999_Common_GameSave_SlotFilled(i))
				C999_Common_GameSave_ConfirmSlot = i;
			else
				C999_Common_GameSave_SaveGame(i);
			return;
		}
	}
	var cy = 150 + 9 * 84 + 16;
	if (MouseX >= 600 && MouseX <= 1320 && MouseY >= cy && MouseY <= cy + 76) {
		C999_Common_GameSave_Continue();
	}
}

function C999_Common_GameSave_SaveGame(SlotNumber) {
	if (typeof SaveState === "function") SaveState(SlotNumber);
}

function C999_Common_GameSave_DeleteSlot(SlotNumber) {
	var SN = String(SlotNumber);
	var keys = [];
	try {
		for (var i = 0; i < localStorage.length; i++) {
			var k = localStorage.key(i);
			if (k && k.indexOf(SN) == k.length - SN.length &&
				(k.indexOf("SaveGame") == 0 || k.indexOf("Current") == 0 ||
				 k.indexOf("Common_") == 0 || k.indexOf("Player") == 0 ||
				 k.indexOf("Actor") == 0 || k.indexOf("GameLog") == 0))
				keys.push(k);
		}
		// Safer: delete known save keys for this slot
		var prefixes = [
			"SaveGameVersion", "SaveGameDateTime", "CurrentChapter", "CurrentScreen",
			"Common_PlayerName", "Common_PlayerOwner", "Common_PlayerLover", "Common_PlayerCloth",
			"PlayerInventory", "PlayerLockedInventory", "PlayerSkill", "Actor", "GameLog",
			"CurrentTime", "CurrentDay", "CurrentMinute",
			"Common_PlayerSedated", "Common_PlayerOwned", "Common_PlayerBroken",
			"Common_PlayerForSale", "Common_PlayerInCage", "Common_PlayerEscaped"
		];
		for (var p = 0; p < prefixes.length; p++)
			localStorage.removeItem(prefixes[p] + SN);
	} catch (e) {}
	if (typeof SaveStateSlotSummary === "function") SaveStateSlotSummary();
}

function C999_Common_GameSave_Continue() {
	if (typeof SaveChapter === "undefined" || !SaveChapter)
		SetScene("C000_Intro", "ChapterSelect");
	else
		SetScene(SaveChapter, SaveScreen || "ChapterSelect");
}
