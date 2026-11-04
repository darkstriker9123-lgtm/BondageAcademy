var C999_Common_GameSave_CurrentStage = 0;

function C999_Common_GameSave_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	LeaveChapter = "C000_Intro";
	if (typeof LoadInteractions === "function") LoadInteractions();
	if (typeof SaveStateSlotSummary === "function") SaveStateSlotSummary();
	if (typeof RunTimer !== "undefined") RunTimer = false;
}

function C999_Common_GameSave_DrawSlotButton(i, y, hover) {
	var x = 200, w = 1520, h = 72;
	DrawRect(x, y, w, h, hover ? "rgba(180,60,100,0.55)" : "rgba(20,12,28,0.72)");
	MainCanvas.strokeStyle = hover ? "rgba(255,200,220,0.9)" : "rgba(255,255,255,0.25)";
	MainCanvas.lineWidth = 2;
	MainCanvas.strokeRect(x, y, w, h);
	MainCanvas.font = "30px Arial";
	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";
	MainCanvas.fillStyle = "#ffffff";
	var label = (typeof GetText === "function") ? (GetText("Slot") || "Slot") : "Slot";
	var summary = "";
	try {
		if (typeof SaveStateGetSummary === "function") summary = SaveStateGetSummary(i) || "";
	} catch (e) {}
	if (!summary) summary = (typeof GetText === "function" && GetText("NoSaveOnSlot")) ? GetText("NoSaveOnSlot") : "Empty";
	MainCanvas.fillText(label + " " + i + "  —  " + summary, x + 28, y + h / 2);
}

function C999_Common_GameSave_Run() {
	// Full-screen readable save UI (do not rely on black text on dark bg)
	if (typeof DrawGetImage === "function" && typeof DrawImageReady === "function") {
		var bg = DrawGetImage(CurrentChapter + "/" + CurrentScreen + "/Save.jpg");
		if (DrawImageReady(bg)) DrawImage(CurrentChapter + "/" + CurrentScreen + "/Save.jpg", 0, 0);
		else DrawRect(0, 0, 1920, 1280, "#1a1220");
	} else {
		DrawRect(0, 0, 1920, 1280, "#1a1220");
	}
	DrawRect(0, 0, 1920, 1280, "rgba(10,6,16,0.35)");

	MainCanvas.font = "48px Arial";
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";
	var title = (typeof GetText === "function") ? (GetText("SaveGame") || "Save Game") : "Save Game";
	MainCanvas.fillText(title, 960, 80);

	MainCanvas.font = "26px Arial";
	MainCanvas.fillStyle = "rgba(255,255,255,0.75)";
	MainCanvas.fillText((CurrentLanguageTag == "CN") ? "选择存档槽" : "Select a slot — then Continue", 960, 130);

	if (typeof SaveStateSlotSummary === "function") SaveStateSlotSummary();

	for (var i = 1; i <= 9; i++) {
		var y = 170 + (i - 1) * 80;
		var hover = (MouseX >= 200 && MouseX <= 1720 && MouseY >= y && MouseY <= y + 72);
		C999_Common_GameSave_DrawSlotButton(i, y, hover);
	}

	// Continue button
	var cy = 170 + 9 * 80 + 20;
	var chov = (MouseX >= 600 && MouseX <= 1320 && MouseY >= cy && MouseY <= cy + 80);
	DrawRect(600, cy, 720, 80, chov ? "rgba(180,60,100,0.7)" : "rgba(40,24,48,0.85)");
	MainCanvas.strokeStyle = "#fff";
	MainCanvas.strokeRect(600, cy, 720, 80);
	MainCanvas.font = "34px Arial";
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.fillText((CurrentLanguageTag == "CN") ? "继续" : "Continue", 960, cy + 40);
}

function C999_Common_GameSave_Click() {
	for (var i = 1; i <= 9; i++) {
		var y = 170 + (i - 1) * 80;
		if (MouseX >= 200 && MouseX <= 1720 && MouseY >= y && MouseY <= y + 72) {
			C999_Common_GameSave_SaveGame(i);
			return;
		}
	}
	var cy = 170 + 9 * 80 + 20;
	if (MouseX >= 600 && MouseX <= 1320 && MouseY >= cy && MouseY <= cy + 80) {
		C999_Common_GameSave_Continue();
	}
}

function C999_Common_GameSave_SaveGame(SlotNumber) {
	if (typeof SaveState === "function") SaveState(SlotNumber);
}

function C999_Common_GameSave_Continue() {
	if (typeof SaveChapter === "undefined" || !SaveChapter)
		SetScene("C000_Intro", "ChapterSelect");
	else
		SetScene(SaveChapter, SaveScreen || "ChapterSelect");
}
