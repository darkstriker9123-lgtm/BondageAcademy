// C001_Day01 — RopeSource (open join kit / practice case for rope)

var C001_Day01_RopeSource_CurrentStage = 0;
var C001_Day01_RopeSource_GotRope = false;

function C001_Day01_RopeSource_Load() {
	LeaveIcon = "Leave";
	LeaveScreen = "Campus";
	LeaveChapter = CurrentChapter;
	CurrentActor = "";
	if (typeof LoadInteractions === "function") LoadInteractions();
	// Already took rope from kit?
	if (typeof PlayerHasInventory === "function" && PlayerHasInventory("Rope"))
		C001_Day01_RopeSource_GotRope = true;
	if (C001_Day01_RopeSource_GotRope)
		C001_Day01_RopeSource_CurrentStage = 20;
	else
		C001_Day01_RopeSource_CurrentStage = 0;
}

function C001_Day01_RopeSource_DrawBg() {
	var bg = CurrentChapter + "/" + CurrentScreen + "/Background.jpg";
	if (typeof DrawGetImage === "function" && typeof DrawImageReady === "function") {
		var img = DrawGetImage(bg);
		if (DrawImageReady(img)) DrawImage(bg, 0, 0);
		else DrawRect(0, 0, 1920, 1280, "#1a1220");
	} else {
		try { DrawImage(bg, 0, 0); } catch (e) { DrawRect(0, 0, 1920, 1280, "#1a1220"); }
	}
}

function C001_Day01_RopeSource_Run() {
	C001_Day01_RopeSource_DrawBg();
	BuildInteraction(C001_Day01_RopeSource_CurrentStage);
}

function C001_Day01_RopeSource_Click() {
	ClickInteraction(C001_Day01_RopeSource_CurrentStage);
	if (typeof InventoryClick === "function")
		InventoryClick(GetClickedInventory(), CurrentChapter, "RopeSource");
}

function C001_Day01_RopeSource_GetRope() {
	if (typeof PlayerAddInventory === "function" && !PlayerHasInventory("Rope"))
		PlayerAddInventory("Rope", 1);
	C001_Day01_RopeSource_GotRope = true;
	if (typeof GameLogSpecificAdd === "function") {
		GameLogSpecificAdd(CurrentChapter, "", "OpenedJoinKitRope");
		GameLogSpecificAdd(CurrentChapter, "", "GotJoinKitRopeDay1");
	}
	if (typeof GameLogAdd === "function") {
		GameLogAdd("OpenedJoinKitRope");
		GameLogAdd("GotJoinKitRopeDay1");
	}
}

function C001_Day01_RopeSource_Back() {
	SetScene(CurrentChapter, "Campus");
}
