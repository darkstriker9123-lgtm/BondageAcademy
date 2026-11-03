// C001_Day01 — Intake (join-kit rope)

function C001_Day01_Intake_Load() {
	StopTimer(9 * 60 * 60 * 1000);
	LeaveIcon = "";
	LeaveScreen = "";
	Common_BondageAllowed = false;
	Common_SelfBondageAllowed = false;
}

function C001_Day01_Intake_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	DrawTextInteraction();
}

function C001_Day01_Intake_Click() {
	if (MouseIn(0, 0, 1920, 1280)) {
		if (typeof TextNext === "function") {
			if (!TextNext()) {
				C001_Day01_Intake_GiveRope();
				SetScene(CurrentChapter, "Campus");
			}
		} else {
			C001_Day01_Intake_GiveRope();
			SetScene(CurrentChapter, "Campus");
		}
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
