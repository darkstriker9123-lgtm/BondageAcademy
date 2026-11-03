// C001_Day01 — Intro (gate / transfer morning)

function C001_Day01_Intro_Load() {
	StopTimer(8 * 60 * 60 * 1000);
	LeaveIcon = "";
	LeaveScreen = "";
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
}

function C001_Day01_Intro_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	DrawTextInteraction();
}

function C001_Day01_Intro_Click() {
	if (MouseIn(0, 0, 1920, 1280)) {
		// advance text; when done go Intake
		if (typeof TextNext === "function") {
			if (!TextNext())
				SetScene(CurrentChapter, "Intake");
		} else {
			SetScene(CurrentChapter, "Intake");
		}
	}
}
