// C001_Day01 — Intro (gate / transfer morning)

function C001_Day01_Intro_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	TextPhase = 0;
	if (typeof StopTimer === "function") StopTimer(8 * 60 * 60 * 1000);
	if (typeof LoadText === "function") LoadText();
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
}

function C001_Day01_Intro_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	DrawRect(40, 40, 900, 700, "rgba(18,10,24,0.55)");
	var lines = ["Line1", "Line2", "Line3", "Line4", "Line5", "Line6"];
	for (var i = 0; i < lines.length; i++) {
		if (TextPhase >= i) {
			var t = (typeof GetText === "function") ? GetText(lines[i]) : lines[i];
			if (!t || String(t).indexOf("MISSING") == 0) t = "";
			if (t) DrawText(t, 490, 100 + i * 90, "White");
		}
	}
}

function C001_Day01_Intro_Click() {
	TextPhase++;
	if (TextPhase >= 6)
		SetScene(CurrentChapter, "Intake");
}
