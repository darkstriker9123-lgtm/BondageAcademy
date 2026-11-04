// C001_Day01 — Sidney (path meet / first bind)

var C001_Day01_Sidney_CurrentStage = 0;
var C001_Day01_Sidney_Done = false;
var C001_Day01_Sidney_BindResolved = false;
var C001_Day01_Sidney_PlayerBoundHer = false;
var C001_Day01_Sidney_SheBoundPlayer = false;
var C001_Day01_Sidney_UntiedHer = false;
var C001_Day01_Sidney_PlayerReleased = false;
var C001_Day01_Sidney_HasRope = false;

function C001_Day01_Sidney_Load() {
	LeaveIcon = "Leave";
	LeaveScreen = "Campus";
	LeaveChapter = CurrentChapter;
	CurrentActor = "Sidney";
	if (typeof ActorLoad === "function") ActorLoad("Sidney");
	if (typeof LoadInteractions === "function") LoadInteractions();

	C001_Day01_Sidney_HasRope = (typeof PlayerHasInventory === "function" && PlayerHasInventory("Rope"));

	// Restore progression
	if (typeof GameLogQuery === "function") {
		if (GameLogQuery(CurrentChapter, "Sidney", "BindResolvedDay1") || GameLogQuery(CurrentChapter, "", "BindResolvedDay1"))
			C001_Day01_Sidney_BindResolved = true;
		if (GameLogQuery(CurrentChapter, "Sidney", "PlayerBoundSidneyDay1"))
			C001_Day01_Sidney_PlayerBoundHer = true;
		if (GameLogQuery(CurrentChapter, "Sidney", "SidneyBoundPlayerDay1"))
			C001_Day01_Sidney_SheBoundPlayer = true;
		if (GameLogQuery(CurrentChapter, "Sidney", "UntiedSidneyDay1"))
			C001_Day01_Sidney_UntiedHer = true;
		if (GameLogQuery(CurrentChapter, "Sidney", "ReleasedPlayerDay1"))
			C001_Day01_Sidney_PlayerReleased = true;
		if (GameLogQuery(CurrentChapter, "Sidney", "SidneySceneDoneDay1"))
			C001_Day01_Sidney_Done = true;
	}

	if (C001_Day01_Sidney_Done) {
		C001_Day01_Sidney_CurrentStage = 310;
	} else if (C001_Day01_Sidney_BindResolved) {
		if (C001_Day01_Sidney_PlayerBoundHer && !C001_Day01_Sidney_UntiedHer) {
			if (C001_Day01_Sidney_CurrentStage < 115)
				C001_Day01_Sidney_CurrentStage = 115;
		} else if (C001_Day01_Sidney_SheBoundPlayer && !C001_Day01_Sidney_PlayerReleased)
			C001_Day01_Sidney_CurrentStage = 210;
		else if (C001_Day01_Sidney_CurrentStage < 300)
			C001_Day01_Sidney_CurrentStage = 300;
	} else if (typeof Common_PlayerRestrained !== "undefined" && Common_PlayerRestrained) {
		C001_Day01_Sidney_CurrentStage = 200;
	} else if (typeof ActorHasInventory === "function" && ActorHasInventory("Rope")) {
		C001_Day01_Sidney_CurrentStage = 100;
	} else if (typeof C001_Day01_Sidney_CurrentStage !== "number") {
		C001_Day01_Sidney_CurrentStage = 0;
	}

	// Player should not look cocky while she is tied
	if (C001_Day01_Sidney_PlayerBoundHer && !C001_Day01_Sidney_UntiedHer)
		Common_PlayerPose = "BackShy";
	else if (!Common_PlayerRestrained)
		Common_PlayerPose = "";
}

function C001_Day01_Sidney_Run() {
	BuildInteraction(C001_Day01_Sidney_CurrentStage);
}

function C001_Day01_Sidney_Click() {
	ClickInteraction(C001_Day01_Sidney_CurrentStage);
	if (typeof InventoryClick === "function")
		InventoryClick(GetClickedInventory(), CurrentChapter, "Sidney");
}

function C001_Day01_Sidney_BindSidney() {
	C001_Day01_Sidney_PlayerBoundHer = true;
	C001_Day01_Sidney_BindResolved = true;
	C001_Day01_Sidney_UntiedHer = false;
	if (typeof ActorAddInventory === "function") ActorAddInventory("Rope");
	// Rope stays in collection; she's wearing the issue
	Common_PlayerPose = "BackShy";
	if (typeof GameLogSpecificAdd === "function") {
		GameLogSpecificAdd(CurrentChapter, "Sidney", "PlayerBoundSidneyDay1");
		GameLogSpecificAdd(CurrentChapter, "Sidney", "BindResolvedDay1");
	}
	if (typeof GameLogAdd === "function") {
		GameLogAdd("PlayerBoundSidneyDay1");
		GameLogAdd("BindResolvedDay1");
	}
}

function C001_Day01_Sidney_BindPlayer() {
	C001_Day01_Sidney_SheBoundPlayer = true;
	C001_Day01_Sidney_BindResolved = true;
	C001_Day01_Sidney_PlayerReleased = false;
	if (typeof PlayerLockInventory === "function") PlayerLockInventory("Rope");
	if (typeof PlayerRemoveInventory === "function" && PlayerHasInventory("Rope"))
		PlayerRemoveInventory("Rope", 1);
	// She has the rope on you — collection may still list it; locked state matters
	Common_PlayerPose = "";
	if (typeof GameLogSpecificAdd === "function") {
		GameLogSpecificAdd(CurrentChapter, "Sidney", "SidneyBoundPlayerDay1");
		GameLogSpecificAdd(CurrentChapter, "Sidney", "BindResolvedDay1");
	}
	if (typeof GameLogAdd === "function") {
		GameLogAdd("SidneyBoundPlayerDay1");
		GameLogAdd("BindResolvedDay1");
	}
}

function C001_Day01_Sidney_UntieSidney() {
	C001_Day01_Sidney_UntiedHer = true;
	if (typeof ActorRemoveInventory === "function") ActorRemoveInventory("Rope");
	if (typeof PlayerAddInventory === "function" && !PlayerHasInventory("Rope"))
		PlayerAddInventory("Rope", 1);
	Common_PlayerPose = "";
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
	C001_Day01_Sidney_PlayerReleased = true;
	if (typeof PlayerUnlockInventory === "function") PlayerUnlockInventory("Rope");
	if (typeof PlayerAddInventory === "function" && !PlayerHasInventory("Rope"))
		PlayerAddInventory("Rope", 1);
	Common_PlayerPose = "";
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "ReleasedPlayerDay1");
	if (typeof GameLogAdd === "function") GameLogAdd("ReleasedPlayerDay1");
}

function C001_Day01_Sidney_LeaveBoundFlag() {
	if (typeof GameLogSpecificAdd === "function") {
		GameLogSpecificAdd(CurrentChapter, "Sidney", "LeftSidneyBoundDay1");
		GameLogSpecificAdd(CurrentChapter, "Sidney", "SidneyAngryLeftBound");
	}
	if (typeof GameLogAdd === "function") {
		GameLogAdd("LeftSidneyBoundDay1");
		GameLogAdd("SidneyAngryLeftBound");
	}
	C001_Day01_Sidney_PlayerBoundHer = true;
	C001_Day01_Sidney_UntiedHer = false;
	Common_PlayerPose = "BackShy";
}

function C001_Day01_Sidney_FinishScene() {
	C001_Day01_Sidney_Done = true;
	C001_Day01_Sidney_CurrentStage = 310;
	CurrentActor = "";
	Common_PlayerPose = "";
	if (typeof GameLogAdd === "function") GameLogAdd("SidneySceneDoneDay1");
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "SidneySceneDoneDay1");
}

function C001_Day01_Sidney_LeaveToCampus() {
	C001_Day01_Sidney_FinishScene();
	LeaveIcon = "";
	SetScene(CurrentChapter, "Campus");
}

function C001_Day01_Sidney_OnLeaveIcon() {
	if (C001_Day01_Sidney_CurrentStage >= 300 || C001_Day01_Sidney_BindResolved)
		C001_Day01_Sidney_FinishScene();
}
