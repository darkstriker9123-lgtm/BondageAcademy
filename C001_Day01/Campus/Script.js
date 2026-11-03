// C001_Day01 — Campus hub
// Outro only after Sidney bind resolved

var C001_Day01_Campus_StatusText = "";

function C001_Day01_Campus_Load() {
	StopTimer(10 * 60 * 60 * 1000);
	LeaveIcon = "";
	LeaveScreen = "";
	Common_BondageAllowed = true;
	Common_SelfBondageAllowed = false;
	C001_Day01_Campus_StatusText = "";
}

function C001_Day01_Campus_IsBindDone() {
	if (typeof C001_Day01_Sidney_BindResolved !== "undefined" && C001_Day01_Sidney_BindResolved)
		return true;
	if (typeof GameLogQuery === "function") {
		if (GameLogQuery(CurrentChapter, "", "BindResolvedDay1")) return true;
		if (GameLogQuery(CurrentChapter, "Sidney", "BindResolvedDay1")) return true;
	}
	return false;
}

function C001_Day01_Campus_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);

	if (C001_Day01_Campus_StatusText != "")
		DrawText(C001_Day01_Campus_StatusText, 960, 1100, "White");

	if (C001_Day01_Campus_IsBindDone())
		DrawText(GetText("OutroReady"), 960, 1180, "White");
}

function C001_Day01_Campus_Click() {
	InventoryClick(GetClickedInventory(), CurrentChapter, "Campus");

	// Notice (left)
	if ((MouseX >= 80) && (MouseX <= 420) && (MouseY >= 200) && (MouseY <= 720)) {
		C001_Day01_Campus_StatusText = GetText("Notice");
		return;
	}

	// Rope case (center) optional
	if ((MouseX >= 480) && (MouseX <= 820) && (MouseY >= 520) && (MouseY <= 900)) {
		C001_Day01_Campus_StatusText = GetText("RopeCase");
		return;
	}

	// Sidney path (right)
	if ((MouseX >= 1100) && (MouseX <= 1600) && (MouseY >= 120) && (MouseY <= 980)) {
		C001_Day01_Campus_StatusText = "";
		SetScene(CurrentChapter, "Sidney");
		return;
	}

	// Dorm (far)
	if ((MouseX >= 1620) && (MouseX <= 1900) && (MouseY >= 400) && (MouseY <= 900)) {
		C001_Day01_Campus_StatusText = GetText("DormPath");
		return;
	}

	// Outro (top) if bind done
	if ((MouseX >= 700) && (MouseX <= 1220) && (MouseY >= 40) && (MouseY <= 160)) {
		if (C001_Day01_Campus_IsBindDone()) {
			C001_Day01_Campus_StatusText = "";
			SetScene(CurrentChapter, "Outro");
		} else {
			C001_Day01_Campus_StatusText = GetText("OutroBlocked");
		}
		return;
	}
}
