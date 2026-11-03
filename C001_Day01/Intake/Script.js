// C001_Day01 — Intake (join-kit rope)

function C001_Day01_Intake_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	TextPhase = 0;
	if (typeof StopTimer === "function") StopTimer(9 * 60 * 60 * 1000);
	if (typeof LoadText === "function") LoadText();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
}

function C001_Day01_Intake_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	DrawRect(40, 40, 900, 780, "rgba(18,10,24,0.55)");
	var lines = ["Line1", "Line2", "Line3", "Line4", "Line5", "Line6", "Line7", "Line8"];
	for (var i = 0; i < lines.length; i++) {
		if (TextPhase >= i) {
			var t = (typeof GetText === "function") ? GetText(lines[i]) : "";
			if (!t || String(t).indexOf("MISSING") == 0) t = "";
			if (t) DrawText(t, 490, 90 + i * 80, "White");
		}
	}
}

function C001_Day01_Intake_Click() {
	TextPhase++;
	if (TextPhase >= 8) {
		C001_Day01_Intake_GiveRope();
		SetScene(CurrentChapter, "Campus");
	}
}

function C001_Day01_Intake_GiveRope() {
	if (typeof PlayerAddInventory === "function" && !PlayerHasInventory("Rope"))
		PlayerAddInventory("Rope", 1);
	if (typeof GameLogAdd === "function")
		GameLogAdd("GotJoinKitRopeDay1");
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "", "GotJoinKitRopeDay1");
}
