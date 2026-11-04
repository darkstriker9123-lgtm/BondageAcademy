// C001_Day01 — Sidney (compulsory bind · untie · then permanently done for Day 1)

var C001_Day01_Sidney_CurrentStage = 0;
var C001_Day01_Sidney_BindResolved = false;
var C001_Day01_Sidney_PlayerBoundHer = false;
var C001_Day01_Sidney_SheBoundPlayer = false;
var C001_Day01_Sidney_UntiedHer = false;
var C001_Day01_Sidney_PlayerReleased = false;
var C001_Day01_Sidney_Done = false;

function C001_Day01_Sidney_IsDone() {
	if (C001_Day01_Sidney_Done) return true;
	if (typeof GameLogQuery === "function") {
		if (GameLogQuery(CurrentChapter, "", "SidneySceneDoneDay1")) return true;
		if (GameLogQuery(CurrentChapter, "Sidney", "SidneySceneDoneDay1")) return true;
	}
	return false;
}

function C001_Day01_Sidney_Load() {
	// Never re-enter full talk after Day 1 scene is finished
	if (C001_Day01_Sidney_IsDone()) {
		C001_Day01_Sidney_Done = true;
		CurrentActor = "";
		LeaveIcon = "";
		SetScene(CurrentChapter, "Campus");
		return;
	}

	ActorLoad("Sidney", "Campus");
	LeaveIcon = "Leave";
	LeaveScreen = "Campus";
	LeaveChapter = CurrentChapter;
	Common_BondageAllowed = true;
	Common_SelfBondageAllowed = false;
	if (typeof LoadInteractions === "function") LoadInteractions();
	// Gate bind options on actually carrying rope
	C001_Day01_Sidney_HasRope = (typeof PlayerHasInventory === "function" && PlayerHasInventory("Rope"));

	if (C001_Day01_Sidney_BindResolved) {
		if (C001_Day01_Sidney_PlayerBoundHer && !C001_Day01_Sidney_UntiedHer)
			C001_Day01_Sidney_CurrentStage = 100;
		else if (C001_Day01_Sidney_SheBoundPlayer && !C001_Day01_Sidney_PlayerReleased)
			C001_Day01_Sidney_CurrentStage = 200;
		else if (C001_Day01_Sidney_CurrentStage < 300)
			C001_Day01_Sidney_CurrentStage = 300;
	} else if (typeof Common_PlayerRestrained !== "undefined" && Common_PlayerRestrained) {
		C001_Day01_Sidney_CurrentStage = 200;
	} else if (typeof ActorHasInventory === "function" && ActorHasInventory("Rope")) {
		C001_Day01_Sidney_CurrentStage = 100;
	} else if (typeof C001_Day01_Sidney_CurrentStage !== "number") {
		C001_Day01_Sidney_CurrentStage = 0;
	}
}

function C001_Day01_Sidney_DrawPlayer() {
	var key = "Normal";
	if (C001_Day01_Sidney_SheBoundPlayer && !C001_Day01_Sidney_PlayerReleased)
		key = "Bound";
	else if (C001_Day01_Sidney_CurrentStage >= 20 && C001_Day01_Sidney_CurrentStage < 100 &&
		typeof PlayerHasInventory === "function" && PlayerHasInventory("Rope"))
		key = "RopeReady";

	var paths = [];
	if (key == "Bound") {
		paths = [
			"C001_Day01/Sidney/Player_Bound.png",
			"C001_Day01/Sidney/Player_Bound.jpg",
			"Actors/Player/Player_Bound.png",
			"Actors/PlayerTransition/Player08.png"
		];
	} else if (key == "RopeReady") {
		paths = [
			"C001_Day01/Sidney/Player_RopeReady.png",
			"C001_Day01/Sidney/Player_RopeReady.jpg",
			"Actors/Player/Player_RopeReady.png",
			"Actors/PlayerTransition/Player01.png"
		];
	} else {
		paths = [
			"C001_Day01/Sidney/Player_Normal.png",
			"C001_Day01/Sidney/Player_Normal.jpg",
			"Actors/Player/Player_Normal.png",
			"Actors/PlayerTransition/Player01.png"
		];
	}
	if (typeof DrawTryPosePaths === "function")
		DrawTryPosePaths(paths, 980);
}

function C001_Day01_Sidney_DrawCharacters() {
	C001_Day01_Sidney_DrawPlayer();
}

function C001_Day01_Sidney_Run() {
	if (C001_Day01_Sidney_IsDone()) {
		SetScene(CurrentChapter, "Campus");
		return;
	}
	// BuildInteraction draws BG → NPC → DrawCharacters (player) → options → dialogue
	BuildInteraction(C001_Day01_Sidney_CurrentStage);
}

function C001_Day01_Sidney_Click() {
	if (C001_Day01_Sidney_IsDone()) {
		SetScene(CurrentChapter, "Campus");
		return;
	}
	if (typeof InventoryClick === "function")
		InventoryClick(GetClickedInventory(), CurrentChapter, CurrentScreen);
	ClickInteraction(C001_Day01_Sidney_CurrentStage);

	// If leave function already marked done, force campus
	if (C001_Day01_Sidney_IsDone()) {
		SetScene(CurrentChapter, "Campus");
	}
}

function C001_Day01_Sidney_MarkResolved() {
	C001_Day01_Sidney_BindResolved = true;
	if (typeof GameLogAdd === "function") GameLogAdd("BindResolvedDay1");
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "BindResolvedDay1");
}

function C001_Day01_Sidney_BindSidney() {
	if (typeof PlayerHasInventory === "function" && !PlayerHasInventory("Rope")) {
		OverridenIntroText = "You need rope for that.";
		return;
	}
	C001_Day01_Sidney_PlayerBoundHer = true;
	C001_Day01_Sidney_SheBoundPlayer = false;
	C001_Day01_Sidney_MarkResolved();
	C001_Day01_Sidney_HasRope = true;
	if (typeof ActorAddInventory === "function") ActorAddInventory("Rope");
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "PlayerBoundSidneyDay1");
}

function C001_Day01_Sidney_BindPlayer() {
	if (typeof PlayerHasInventory === "function" && !PlayerHasInventory("Rope")) {
		OverridenIntroText = "There's no rope to use.";
		return;
	}
	C001_Day01_Sidney_SheBoundPlayer = true;
	C001_Day01_Sidney_PlayerBoundHer = false;
	C001_Day01_Sidney_MarkResolved();
	if (typeof PlayerLockInventory === "function") PlayerLockInventory("Rope");
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "SidneyBoundPlayerDay1");
}

function C001_Day01_Sidney_UntieSidney() {
	C001_Day01_Sidney_UntiedHer = true;
	if (typeof ActorRemoveInventory === "function") ActorRemoveInventory("Rope");
	if (typeof PlayerAddInventory === "function" && !PlayerHasInventory("Rope"))
		PlayerAddInventory("Rope", 1);
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
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "Sidney", "ReleasedPlayerDay1");
	if (typeof GameLogAdd === "function") GameLogAdd("ReleasedPlayerDay1");
}

function C001_Day01_Sidney_LeaveBoundFlag() {
	if (C001_Day01_Sidney_PlayerBoundHer && !C001_Day01_Sidney_UntiedHer) {
		if (typeof GameLogSpecificAdd === "function")
			GameLogSpecificAdd(CurrentChapter, "Sidney", "LeftSidneyBoundDay1");
		if (typeof GameLogAdd === "function") GameLogAdd("LeftSidneyBoundDay1");
	}
}

function C001_Day01_Sidney_FinishScene() {
	C001_Day01_Sidney_Done = true;
	C001_Day01_Sidney_CurrentStage = 310;
	CurrentActor = "";
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
	// Top leave after bind resolved / end talk = done for the day
	if (C001_Day01_Sidney_CurrentStage >= 300 || C001_Day01_Sidney_BindResolved)
		C001_Day01_Sidney_FinishScene();
}
