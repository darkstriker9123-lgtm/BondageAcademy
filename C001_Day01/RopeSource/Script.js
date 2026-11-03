// C001_Day01 — RopeSource (optional extra practice rope)

var C001_Day01_RopeSource_CurrentStage = 0;
var C001_Day01_RopeSource_GotRope = false;

function C001_Day01_RopeSource_Load() {
	LeaveIcon = "Leave";
	LeaveScreen = "Campus";
	CurrentActor = "";
	if (typeof LoadInteractions === "function") LoadInteractions();
	if (C001_Day01_RopeSource_GotRope || (typeof PlayerHasInventory === "function" && PlayerHasInventory("Rope") && C001_Day01_RopeSource_GotRope))
		C001_Day01_RopeSource_CurrentStage = 20;
	else if (C001_Day01_RopeSource_GotRope)
		C001_Day01_RopeSource_CurrentStage = 20;
	else
		C001_Day01_RopeSource_CurrentStage = 0;
}

function C001_Day01_RopeSource_Run() {
	BuildInteraction(C001_Day01_RopeSource_CurrentStage);
}

function C001_Day01_RopeSource_Click() {
	ClickInteraction(C001_Day01_RopeSource_CurrentStage);
	if (typeof InventoryClick === "function")
		InventoryClick(GetClickedInventory(), CurrentChapter, "RopeSource");
}

function C001_Day01_RopeSource_GetRope() {
	if (typeof PlayerAddInventory === "function")
		PlayerAddInventory("Rope", 1);
	C001_Day01_RopeSource_GotRope = true;
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "", "TookPracticeRope");
	if (typeof GameLogAdd === "function")
		GameLogAdd("TookPracticeRope");
}
