// C001_Day01 — RopeSource (optional extra practice rope)

var C001_Day01_RopeSource_CurrentStage = 0;
var C001_Day01_RopeSource_GotRope = false;

function C001_Day01_RopeSource_Load() {
	LeaveIcon = "Leave";
	LeaveScreen = "Campus";
	CurrentActor = "";
	if (typeof LoadInteractions === "function") LoadInteractions();
	if (C001_Day01_RopeSource_GotRope)
		C001_Day01_RopeSource_CurrentStage = 20;
	else
		C001_Day01_RopeSource_CurrentStage = 0;
}

function C001_Day01_RopeSource_DrawBg() {
	var base = CurrentChapter + "/" + CurrentScreen + "/";
	var list = ["CaseOpen.jpg", "CaseOpen.png", "Background.jpg", "Background.png"];
	for (var i = 0; i < list.length; i++) {
		var src = base + list[i];
		var img = DrawGetImage(src);
		if (typeof DrawImageReady === "function" && DrawImageReady(img)) {
			DrawImage(src, 0, 0);
			return;
		}
	}
	DrawRect(0, 0, UI_W, UI_H, "#1a1220");
}

function C001_Day01_RopeSource_Run() {
	// Draw our bg first so CaseOpen is used even if BuildInteraction defaults differ
	C001_Day01_RopeSource_DrawBg();
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
