// C001_Day01 — Sidney
// Compulsory bind (either direction). Untie → NoRevengeDay2.
// After scene fully done, re-entry only shows residual (no full restart).

var C001_Day01_Sidney_CurrentStage = 0;
var C001_Day01_Sidney_BindResolved = false;
var C001_Day01_Sidney_PlayerBoundHer = false;
var C001_Day01_Sidney_SheBoundPlayer = false;
var C001_Day01_Sidney_UntiedHer = false;
var C001_Day01_Sidney_PlayerReleased = false;
var C001_Day01_Sidney_Done = false;

function C001_Day01_Sidney_Load() {
	ActorLoad("Sidney", "Campus");
	LeaveIcon = "Leave";
	LeaveScreen = "Campus";
	Common_BondageAllowed = true;
	Common_SelfBondageAllowed = false;
	if (typeof LoadInteractions === "function") LoadInteractions();

	if (C001_Day01_Sidney_Done) {
		C001_Day01_Sidney_CurrentStage = 310;
		return;
	}

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
	} else if (typeof C001_Day01_Sidney_CurrentStage !== "number") {
		C001_Day01_Sidney_CurrentStage = 0;
	}
}

function C001_Day01_Sidney_DrawPlayer() {
	// Pick player pose for current beat
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

function C001_Day01_Sidney_Run() {
	BuildInteraction(C001_Day01_Sidney_CurrentStage);
	C001_Day01_Sidney_DrawPlayer();
}

function C001_Day01_Sidney_Click() {
	ClickInteraction(C001_Day01_Sidney_CurrentStage);
	if (typeof InventoryClick === "function")
		InventoryClick(GetClickedInventory(), CurrentChapter, "Sidney");

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

function C001_Day01_Sidney_FinishScene() {
	C001_Day01_Sidney_Done = true;
	C001_Day01_Sidney_CurrentStage = 310;
	if (typeof GameLogAdd === "function")
		GameLogAdd("SidneySceneDoneDay1");
}

function C001_Day01_Sidney_LeaveToCampus() {
	C001_Day01_Sidney_FinishScene();
	SetScene(CurrentChapter, "Campus");
}
