var C001_Day01_RopeSource_CurrentStage = 0;
var C001_Day01_RopeSource_GotRope = false;

// Chapter 1 - Day 01 RopeSource Load
function C001_Day01_RopeSource_Load() {

	LeaveIcon = "Leave";
	LeaveScreen = "Campus";
	LoadInteractions();

	// Already took rope this day
	if (C001_Day01_RopeSource_GotRope || PlayerHasInventory("Rope"))
		C001_Day01_RopeSource_CurrentStage = 20;
	else
		C001_Day01_RopeSource_CurrentStage = 0;

}

// Chapter 1 - Day 01 RopeSource Run
function C001_Day01_RopeSource_Run() {
	BuildInteraction(C001_Day01_RopeSource_CurrentStage);
}

// Chapter 1 - Day 01 RopeSource Click
function C001_Day01_RopeSource_Click() {
	ClickInteraction(C001_Day01_RopeSource_CurrentStage);
	InventoryClick(GetClickedInventory(), CurrentChapter, "RopeSource");
}

// Take soft rope from the practice case
function C001_Day01_RopeSource_GetRope() {
	PlayerAddInventory("Rope", 2);
	C001_Day01_RopeSource_GotRope = true;
	if (typeof GameLogSpecificAdd === "function")
		GameLogSpecificAdd(CurrentChapter, "", "TookPracticeRope");
}
