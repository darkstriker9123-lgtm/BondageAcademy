// C001_Day01 — Intake (join-kit rope)

function C001_Day01_Intake_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	TextPhase = 0;
	CurrentActor = "";
	if (typeof StopTimer === "function") StopTimer(9 * 60 * 60 * 1000);
	if (typeof LoadText === "function") LoadText();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
}

function C001_Day01_Intake_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	var keys = ["Line1", "Line2", "Line3", "Line4", "Line5", "Line6", "Line7", "Line8"];
	if (typeof DrawStoryPanel === "function") {
		DrawStoryPanel(keys, TextPhase, { x: 48, y: UI_TOP_H + 20, w: 880, h: 960 });
	} else {
		DrawRect(48, UI_TOP_H + 20, 880, 960, "rgba(18,10,24,0.62)");
		for (var i = 0; i < keys.length; i++) {
			if (TextPhase < i) break;
			var t = (typeof GetText === "function") ? GetText(keys[i]) : "";
			if (t && String(t).indexOf("MISSING") != 0)
				DrawTextLeft(t, 84, UI_TOP_H + 70 + i * 90, "White");
		}
	}
}

function C001_Day01_Intake_Click() {
	TextPhase++;
	if (TextPhase >= 8) {
		// Kit is issued closed — rope is inside; open the case on campus to take it
		if (typeof GameLogAdd === "function") GameLogAdd("GotJoinKitDay1");
		if (typeof GameLogSpecificAdd === "function")
			GameLogSpecificAdd(CurrentChapter, "", "GotJoinKitDay1");
		SetScene(CurrentChapter, "Campus");
	}
}
