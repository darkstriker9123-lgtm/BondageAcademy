var C999_Common_Rope_CurrentStage = 0;
var C999_Common_Rope_HasLooseRope = 0;
var C999_Common_Rope_IsRopeMasterTwo = 0;

// Remember where to return (InventoryClick sets these after SetScene; keep a backup)
var C999_Common_Rope_ReturnChapter = "";
var C999_Common_Rope_ReturnScreen = "";

function C999_Common_Rope_Load() {
	// Capture return target before anything else can clear it
	if (LeaveChapter && LeaveChapter != "C999_Common")
		C999_Common_Rope_ReturnChapter = LeaveChapter;
	if (LeaveScreen && LeaveScreen != "Rope")
		C999_Common_Rope_ReturnScreen = LeaveScreen;

	LeaveIcon = "Leave";
	if (C999_Common_Rope_ReturnChapter) LeaveChapter = C999_Common_Rope_ReturnChapter;
	if (C999_Common_Rope_ReturnScreen) LeaveScreen = C999_Common_Rope_ReturnScreen;
	// Sensible Day 1 fallback
	if (!LeaveScreen || LeaveScreen == "Rope") {
		LeaveChapter = "C001_Day01";
		LeaveScreen = "Campus";
		C999_Common_Rope_ReturnChapter = LeaveChapter;
		C999_Common_Rope_ReturnScreen = LeaveScreen;
	}

	if (typeof LoadInteractions === "function") LoadInteractions();

	if (PlayerHasLockedInventory("Rope") == true) C999_Common_Rope_CurrentStage = 10;
	else C999_Common_Rope_CurrentStage = 0;

	C999_Common_Rope_HasLooseRope = PlayerHasInventory("Rope");
	C999_Common_Rope_IsRopeMasterTwo = (PlayerGetSkillLevel("RopeMastery") >= 2);
}

function C999_Common_Rope_Run() {
	// Keep leave available every frame
	LeaveIcon = "Leave";
	if (C999_Common_Rope_ReturnChapter) LeaveChapter = C999_Common_Rope_ReturnChapter;
	if (C999_Common_Rope_ReturnScreen) LeaveScreen = C999_Common_Rope_ReturnScreen;

	BuildInteraction(C999_Common_Rope_CurrentStage);
	if (PlayerHasLockedInventory("Rope") && (OverridenIntroImage == ""))
		DrawPlayerImage(150, 240);
}

function C999_Common_Rope_Click() {
	OverridenIntroImage = "";
	ClickInteraction(C999_Common_Rope_CurrentStage);
	if (typeof InventoryClick === "function")
		InventoryClick(GetClickedInventory(), LeaveChapter, LeaveScreen);
}

function C999_Common_Rope_ShowImage() {
	OverridenIntroImage = "Rope.jpg";
}

function C999_Common_Rope_QuerySelfBondage() {
	if ((Common_BondageAllowed) && (Common_SelfBondageAllowed)) {
		if (PlayerGetSkillLevel("RopeMastery") >= 1) {
			C999_Common_Rope_CurrentStage = 20;
			OverridenIntroText = GetText("ConfirmSelfBondage");
		}
	} else OverridenIntroText = GetText("BadTiming");
}

function C999_Common_Rope_DoSelfBondage() {
	PlayerLockInventory("Rope");
	// Rope stays in permanent collection; locked state is what matters
	C999_Common_Rope_HasLooseRope = PlayerHasInventory("Rope");
}

function C999_Common_Rope_DoFreeSelf() {
	PlayerUnlockInventory("Rope");
	PlayerAddInventory("Rope", 1);
	C999_Common_Rope_CurrentStage = 0;
	OverridenIntroText = GetText("FreeSelf");
}

function C999_Common_Rope_Back() {
	var ch = C999_Common_Rope_ReturnChapter || LeaveChapter || "C001_Day01";
	var sc = C999_Common_Rope_ReturnScreen || LeaveScreen || "Campus";
	if (ch == "C999_Common") { ch = "C001_Day01"; sc = "Campus"; }
	SetScene(ch, sc);
}
