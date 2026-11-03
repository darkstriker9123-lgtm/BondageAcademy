// C001_Day01 — Sidney
// Compulsory bind (either direction) · untie available · untie clears Day2 revenge

var C001_Day01_Sidney_CurrentStage = 0;
var C001_Day01_Sidney_BindResolved = false;
var C001_Day01_Sidney_PlayerBoundHer = false;
var C001_Day01_Sidney_SheBoundPlayer = false;
var C001_Day01_Sidney_UntiedHer = false;
var C001_Day01_Sidney_PlayerReleased = false;
var C001_Day01_Sidney_PlayerHasRope = false;

function C001_Day01_Sidney_Load() {

	ActorLoad("Sidney", "Campus");
	LeaveIcon = "Leave";
	LeaveScreen = "Campus";
	Common_BondageAllowed = true;
	Common_SelfBondageAllowed = false;

	C001_Day01_Sidney_PlayerHasRope = PlayerHasInventory("Rope");

	LoadInteractions();

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
	}

}

function C001_Day01_Sidney_Run() {
	BuildInteraction(C001_Day01_Sidney_CurrentStage);
}

function C001_Day01_Sidney_Click() {
	ClickInteraction(C001_Day01_Sidney_CurrentStage);
	InventoryClick(GetClickedInventory(), CurrentChapter, "Sidney");
}

function C001_Day01_Sidney_MarkResolved() {
	C001_Day01_Sidney_BindResolved = true;
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "BindResolvedDay1");
	if (typeof GameLogAdd === "function")
		GameLogAdd("BindResolvedDay1");
}

function C001_Day01_Sidney_BindSidney() {
	if (PlayerHasInventory("Rope")) {
		PlayerRemoveInventory("Rope", 1);
		ActorAddInventory("Rope");
	} else {
		ActorAddInventory("Rope");
	}
	C001_Day01_Sidney_PlayerBoundHer = true;
	C001_Day01_Sidney_SheBoundPlayer = false;
	C001_Day01_Sidney_MarkResolved();
	ActorChangeAttitude(0, 1);
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "PlayerBoundSidneyDay1");
	if (typeof GameLogAdd === "function")
		GameLogAdd("PlayerBoundSidneyDay1");
}

function C001_Day01_Sidney_BindPlayer() {
	if (PlayerHasInventory("Rope"))
		PlayerRemoveInventory("Rope", 1);
	if (typeof PlayerLockInventory === "function")
		PlayerLockInventory("Rope");
	else if (typeof Common_PlayerRestrained !== "undefined")
		Common_PlayerRestrained = true;
	C001_Day01_Sidney_SheBoundPlayer = true;
	C001_Day01_Sidney_PlayerBoundHer = false;
	C001_Day01_Sidney_MarkResolved();
	ActorChangeAttitude(0, -1);
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "SidneyBoundPlayerDay1");
	if (typeof GameLogAdd === "function")
		GameLogAdd("SidneyBoundPlayerDay1");
}

// Untie Sidney — no revenge on Day 2; you can still meet her
function C001_Day01_Sidney_UntieSidney() {
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
	else if (typeof Common_PlayerRestrained !== "undefined")
		Common_PlayerRestrained = false;
	if (typeof PlayerAddInventory === "function" && !PlayerHasInventory("Rope"))
		PlayerAddInventory("Rope", 1);
	C001_Day01_Sidney_PlayerReleased = true;
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "ReleasedPlayerDay1");
	if (typeof GameLogAdd === "function")
		GameLogAdd("ReleasedPlayerDay1");
}

// Leave her still bound → revenge available on Day 2
function C001_Day01_Sidney_LeaveBoundFlag() {
	if (C001_Day01_Sidney_PlayerBoundHer && !C001_Day01_Sidney_UntiedHer) {
		if (typeof GameLogSpecificAdd === "function")
			GameLogSpecificAdd(CurrentChapter, "Sidney", "LeftSidneyBoundDay1");
		if (typeof GameLogAdd === "function")
			GameLogAdd("LeftSidneyBoundDay1");
	}
}
