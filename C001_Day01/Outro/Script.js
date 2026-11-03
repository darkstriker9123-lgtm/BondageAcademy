// C001_Day01 — Outro → Day 02

function C001_Day01_Outro_Load() {
	StopTimer(21 * 60 * 60 * 1000);
	LeaveIcon = "";
	LeaveScreen = "";
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
	if (typeof GameLogAdd === "function")
		GameLogAdd("CompletedDay01");
}

function C001_Day01_Outro_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	DrawTextInteraction();
}

function C001_Day01_Outro_Click() {
	if (MouseIn(0, 0, 1920, 1280)) {
		if (typeof TextNext === "function") {
			if (!TextNext())
				C001_Day01_Outro_ToDay02();
		} else {
			C001_Day01_Outro_ToDay02();
		}
	}
}

function C001_Day01_Outro_ToDay02() {
	if (typeof StartNewDay === "function") {
		// advance calendar if engine supports
	}
	SetScene("C002_Day02", "Intro");
}
