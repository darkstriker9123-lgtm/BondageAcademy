// C001_Day01 — Sidney
// Compulsory bind (either direction). Untie clears Day2 revenge flag.

var C001_Day01_Sidney_CurrentStage = 0;
var C001_Day01_Sidney_BindResolved = false;
var C001_Day01_Sidney_PlayerBoundHer = false;
var C001_Day01_Sidney_SheBoundPlayer = false;
var C001_Day01_Sidney_UntiedHer = false;
var C001_Day01_Sidney_PlayerReleased = false;

function C001_Day01_Sidney_Load() {
	ActorLoad("Sidney", "Campus");
	LeaveIcon = "Leave";
	LeaveScreen = "Campus";
	Common_BondageAllowed = true;
	Common_SelfBondageAllowed = false;
	if (typeof LoadInteractions === "function") LoadInteractions();

	// Resume correct branch
	if (C001_Day01_Sidney_BindResolved) {
		if (C001_Day01_Sidney_PlayerBoundHer && !C001_Day01_Sidney_UntiedHer)
			C001_Day01_Sidney_CurrentStage = 100;
		else if (C001_Day01_Sidney_SheBoundPlayer && !C001_Day01_Sidney_PlayerReleased)
			C001_Day01_Sidney_CurrentStage = 200;
		else
			C001_Day01_Sidney_CurrentStage = 300;
	} else if (typeof Common_PlayerRestrained !== "undefined" && Common_PlayerRestrained) {
		C001_Day01_Sidney_CurrentStage = 200;
	} else if (typeof ActorHasInventory === "function" && ActorHasInventory("Rope")) {
		C001_Day01_Sidney_CurrentStage = 100;
	} else {
		// keep existing stage if mid-talk, else start
		if (typeof C001_Day01_Sidney_CurrentStage !== "number")
			C001_Day01_Sidney_CurrentStage = 0;
	}
}

function C001_Day01_Sidney_Run() {
	BuildInteraction(C001_Day01_Sidney_CurrentStage);
}

function C001_Day01_Sidney_Click() {
	ClickInteraction(C001_Day01_Sidney_CurrentStage);
	if (typeof InventoryClick === "function")
		InventoryClick(GetClickedInventory(), CurrentChapter, "Sidney");

	// Using rope from inventory on Sidney (before resolved) → bind her path
	if (!C001_Day01_Sidney_BindResolved &&
		typeof GetClickedInventory === "function" &&
		GetClickedInventory() == "Rope" &&
		C001_Day01_Sidney_CurrentStage < 100) {
		C001_Day01_Sidney_BindSidney();
		C001_Day01_Sidney_CurrentStage = 100;
		OverridenIntroText = "The rope settles. She tests it once.";
	}
}

function C001_Day01_Sidney_MarkResolved() {
	C001_Day01_Sidney_BindResolved = true;
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "BindResolvedDay1");
	if (typeof GameLogAdd === "function")
		GameLogAdd("BindResolvedDay1");
}

function C001_Day01_Sidney_BindSidney() {
	if (typeof PlayerHasInventory === "function" && PlayerHasInventory("Rope")) {
		if (typeof PlayerRemoveInventory === "function")
			PlayerRemoveInventory("Rope", 1);
	}
	if (typeof ActorAddInventory === "function")
		ActorAddInventory("Rope");
	C001_Day01_Sidney_PlayerBoundHer = true;
	C001_Day01_Sidney_SheBoundPlayer = false;
	C001_Day01_Sidney_MarkResolved();
	if (typeof ActorChangeAttitude === "function")
		ActorChangeAttitude(0, 1);
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "PlayerBoundSidneyDay1");
	if (typeof GameLogAdd === "function")
		GameLogAdd("PlayerBoundSidneyDay1");
}

function C001_Day01_Sidney_BindPlayer() {
	if (typeof PlayerHasInventory === "function" && PlayerHasInventory("Rope")) {
		if (typeof PlayerRemoveInventory === "function")
			PlayerRemoveInventory("Rope", 1);
	}
	if (typeof PlayerLockInventory === "function")
		PlayerLockInventory("Rope");
	C001_Day01_Sidney_SheBoundPlayer = true;
	C001_Day01_Sidney_PlayerBoundHer = false;
	C001_Day01_Sidney_MarkResolved();
	if (typeof ActorChangeAttitude === "function")
		ActorChangeAttitude(0, -1);
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "SidneyBoundPlayerDay1");
	if (typeof GameLogAdd === "function")
		GameLogAdd("SidneyBoundPlayerDay1");
}

function C001_Day01_Sidney_UntieSidney() {
	if (typeof ActorRemoveInventory === "function")
		ActorRemoveInventory("Rope");
	if (typeof PlayerAddInventory === "function" && !PlayerHasInventory("Rope"))
		PlayerAddInventory("Rope", 1);
	C001_Day01_Sidney_UntiedHer = true;
	if (typeof GameLogSpecificAdd === "function") {
		GameLogSpecificAdd(CurrentChapter, "Sidney", "UntiedSidneyDay1");
		GameLogSpecificAdd(CurrentChapter, "Sidney", "NoRevengeDay2");
	}
	if (typeof GameLogAdd === "function") {
		GameLogAdd("UntiedSidneyDay1");
		GameLogAdd("NoRevengeDay2");
	}
}

function C001_Day01_Sidney_ReleasePlayer() {
	if (typeof PlayerUnlockInventory === "function")
		PlayerUnlockInventory("Rope");
	if (typeof PlayerAddInventory === "function" && !PlayerHasInventory("Rope"))
		PlayerAddInventory("Rope", 1);
	C001_Day01_Sidney_PlayerReleased = true;
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "ReleasedPlayerDay1");
	if (typeof GameLogAdd === "function")
		GameLogAdd("ReleasedPlayerDay1");
}

function C001_Day01_Sidney_LeaveBoundFlag() {
	if (C001_Day01_Sidney_PlayerBoundHer && !C001_Day01_Sidney_UntiedHer) {
		if (typeof GameLogSpecificAdd === "function")
			GameLogSpecificAdd(CurrentChapter, "Sidney", "LeftSidneyBoundDay1");
		if (typeof GameLogAdd === "function")
			GameLogAdd("LeftSidneyBoundDay1");
	}
}
