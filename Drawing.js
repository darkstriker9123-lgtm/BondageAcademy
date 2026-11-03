// ===== LAYOUT 1920 x 1280 (3:2) =====
// Top: inventory bar
// Main: full scene image + options on the RIGHT
// Bottom: dialogue (no head) + Julia-style stats on the right
var UI_W = 1920;
var UI_H = 1280;
var UI_TOP_H = 100;
var UI_BOTTOM_Y = 1080;
var UI_BOTTOM_H = 200;
var UI_ICON = 90;
var UI_OPT_X = 1420;
var UI_OPT_W = 480;
var UI_OPT_H = 110;
var UI_OPT_TOP = 120;
var UI_OPT_GAP = 8;
var UI_FONT = "34px Arial";
var UI_FONT_SM = "28px Arial";
var UI_OPT_MAX = 5;			// max visible options (5th can be Next/Back)
var InteractionOptionPage = 0;	// pagination page for options


var MainCanvas;
var CacheImage = {};

var Icons = new function () {
    this.Path = "Icons";
    this.Fight = new function () {
        this.Path = "C999_Common/Fights/Icons";
        this.Punch = this.Path + "/Punch";
        this.Rope = this.Path + "/Rope";
        this.TennisBall = this.Path + "/TennisBall";
    }();
    this.Race = new function () {
        this.Path = "C999_Common/Races/Icons";
        this.ElbowBound = this.Path + "/ElbowBound";
        this.KneeBound = this.Path + "/KneeBound";
    }();
    this.Navigation = new function () {
        this.Path = "Icons/Navigation";
        this.ArrowLeftActive = this.Path + "/ArrowLeftActive";
        this.ArrowRightActive = this.Path + "/ArrowRightActive";
        this.ArrowUpActive = this.Path + "/ArrowUpActive";
        this.ArrowDownActive = this.Path + "/ArrowDownActive";
        this.ArrowLeftInactive = this.Path + "/ArrowLeftInactive";
        this.ArrowRightInactive = this.Path + "/ArrowRightInactive";
        this.ArrowUpInactive = this.Path + "/ArrowUpInactive";
        this.ArrowDownInactive = this.Path + "/ArrowDownInactive";
    }();
}();

function GetIconPath(Path, Name) {
	return Path + "/" + Name + ".png";
}

function DrawGetImage(Source) {
    if (!Source) return null;
    if (!CacheImage[Source]) {
        var img = new Image();
        img.src = Source;
        img.onerror = function () { this._broken = true; };
        CacheImage[Source] = img;
    }
    return CacheImage[Source];
}

function DrawImageReady(img) {
	return img && !img._broken && img.complete && img.naturalWidth > 0;
}

function DrawImageZoom(Source, SX, SY, SWidth, SHeight, X, Y, Width, Height) {
	var img = DrawGetImage(Source);
	if (!DrawImageReady(img)) return;
	try {
		MainCanvas.drawImage(img, SX, SY, Math.round(SWidth), Math.round(SHeight), X, Y, Width, Height);
	} catch (e) {}
}

function DrawImageZoomMirror(Source, SX, SY, SWidth, SHeight, X, Y, Width, Height) {
	var img = DrawGetImage(Source);
	if (!DrawImageReady(img)) return;
	MainCanvas.save();
	MainCanvas.scale(-1, 1);
	try {
		MainCanvas.drawImage(img, X * -1, Y, Width * -1, Height);
	} catch (e) {}
	MainCanvas.restore();
}

function DrawImage(Source, X, Y) {
	var img = DrawGetImage(Source);
	if (!DrawImageReady(img)) return;
	try {
		MainCanvas.drawImage(img, X, Y);
	} catch (e) {}
}

function DrawImageMirror(Source, X, Y) {
	var img = DrawGetImage(Source);
	if (!DrawImageReady(img)) return;
	MainCanvas.save();
	MainCanvas.scale(-1, 1);
	try {
		MainCanvas.drawImage(img, X * -1, Y);
	} catch (e) {}
	MainCanvas.restore();
}

function DrawText(Text, X, Y, Color) {
	Text = Text.replace("COMMON_PLAYERNAME", Common_PlayerName);
	Text = Text.replace("COMMON_NUMBER", Common_Number);
	if (Text.indexOf("ADD_MINUTES:") >= 0)
		Text = Text.substring(0, Text.indexOf("ADD_MINUTES:"));
	MainCanvas.font = UI_FONT;
	MainCanvas.fillStyle = Color;
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";
	if (Text.indexOf("|") == -1)
		MainCanvas.fillText(Text, X, Y);
	else {
		MainCanvas.fillText(Text.substring(0, Text.indexOf("|")), X, Y - 26);
		MainCanvas.fillText(Text.substring(Text.indexOf("|") + 1, 1000), X, Y + 26);
	}
}


// Safe stub: some early chapter scripts called this; engine uses TextPhase + DrawText instead

// Story text panel: left-aligned wrapped lines under top bar
function DrawStoryPanel(lineKeys, phase, opt) {
	opt = opt || {};
	var x = opt.x != null ? opt.x : 48;
	var y = opt.y != null ? opt.y : (UI_TOP_H + 24);
	var w = opt.w != null ? opt.w : 860;
	var h = opt.h != null ? opt.h : 780;
	var pad = opt.pad != null ? opt.pad : 36;
	var lineH = opt.lineH != null ? opt.lineH : 52;
	DrawRect(x, y, w, h, "rgba(18,10,24,0.62)");
	MainCanvas.strokeStyle = "rgba(255,200,220,0.25)";
	MainCanvas.lineWidth = 2;
	MainCanvas.strokeRect(x, y, w, h);
	MainCanvas.font = UI_FONT;
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "top";
	var maxW = w - pad * 2;
	var cy = y + pad;
	var maxY = y + h - pad;
	for (var i = 0; i < lineKeys.length; i++) {
		if (phase < i) break;
		var raw = (typeof GetText === "function") ? GetText(lineKeys[i]) : lineKeys[i];
		if (!raw || String(raw).indexOf("MISSING") == 0) continue;
		raw = String(raw).replace("COMMON_PLAYERNAME", typeof Common_PlayerName !== "undefined" ? Common_PlayerName : "");
		var words = raw.split(" ");
		var line = "";
		for (var wi = 0; wi < words.length; wi++) {
			var test = line ? (line + " " + words[wi]) : words[wi];
			if (MainCanvas.measureText(test).width > maxW && line) {
				MainCanvas.fillText(line, x + pad, cy);
				cy += lineH;
				line = words[wi];
				if (cy > maxY) return;
			} else {
				line = test;
			}
		}
		if (line) {
			MainCanvas.fillText(line, x + pad, cy);
			cy += lineH + 12;
		}
		if (cy > maxY) return;
	}
}

function DrawTextInteraction() {
	// no-op fallback — prefer explicit TextPhase drawing in chapter scripts
}

function DrawTextLeft(Text, X, Y, Color, Font) {
	MainCanvas.font = Font || UI_FONT;
	MainCanvas.fillStyle = Color;
	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";
	MainCanvas.fillText(Text, X, Y);
}

function DrawButton(Left, Top, Width, Height, Label) {
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
    MainCanvas.fillStyle = "white";
    MainCanvas.fillRect(Left, Top, Width, Height);
	MainCanvas.fill();
	MainCanvas.lineWidth = "2";
	MainCanvas.strokeStyle = "black";
	MainCanvas.stroke();
	MainCanvas.closePath();
	DrawText(Label, Left + Width / 2, Top + Height / 2, "black");
}

function DrawRect(Left, Top, Width, Height, Color) {
	MainCanvas.beginPath();
	MainCanvas.rect(Left, Top, Width, Height);
    MainCanvas.fillStyle = Color;
    MainCanvas.fillRect(Left, Top, Width, Height);
	MainCanvas.fill();
	MainCanvas.closePath();
}

function DrawCircle(CenterX, CenterY, Radius, LineWidth, LineColor) {
	MainCanvas.beginPath();
	MainCanvas.arc(CenterX, CenterY, Radius, 0, 2 * Math.PI, false);
	MainCanvas.lineWidth = LineWidth;
	MainCanvas.strokeStyle = LineColor;
	MainCanvas.stroke();
}

function DrawPosNegValue(Value, X, Y) {
	MainCanvas.font = UI_FONT_SM;
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";
	if (Value == 0) { MainCanvas.fillStyle = "black"; MainCanvas.fillText("---", X, Y); }
	if (Value > 0) { MainCanvas.fillStyle = "#00AA00"; MainCanvas.fillText("+" + Value.toString(), X, Y); }
	if (Value < 0) { MainCanvas.fillStyle = "#CC0000"; MainCanvas.fillText(Value.toString(), X, Y); }
}

function DrawActorStatsBar() {
	if (CurrentActor == "") return;

	// Vertical stats panel on the right side of the bottom bar
	var panelX = 1520;
	var panelW = 380;
	var rowH = 32;
	var startY = UI_BOTTOM_Y + 20;

	MainCanvas.font = UI_FONT_SM;
	MainCanvas.fillStyle = "black";
	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";

	// Name
	MainCanvas.font = UI_FONT;
	MainCanvas.fillText(ActorGetDisplayName(), panelX, startY);
	if (CurrentActor == Common_PlayerLover)
		DrawImage("Icons/Lover.png", panelX + 200, startY - 20);

	// Love
	var y = startY + rowH;
	DrawImage("Icons/Heart.png", panelX, y - 20);
	DrawPosNegValue(ActorGetValue(ActorLove), panelX + 90, y);

	// Submission / Domination
	y += rowH;
	if (ActorGetValue(ActorOwner) == "Player") DrawImage("Icons/Collared.png", panelX, y - 20);
	else if (CurrentActor == Common_PlayerOwner) DrawImage("Icons/Owner.png", panelX, y - 20);
	else DrawImage("Icons/Submission.png", panelX, y - 20);
	DrawPosNegValue(ActorGetValue(ActorSubmission), panelX + 90, y);

	// Orgasm count
	y += rowH;
	DrawImage("Icons/Orgasm.png", panelX, y - 20);
	MainCanvas.font = UI_FONT_SM;
	MainCanvas.fillStyle = "black";
	MainCanvas.textAlign = "center";
	MainCanvas.fillText(ActorGetValue(ActorOrgasmCount).toString(), panelX + 90, y);

	// Bondage count
	y += rowH;
	DrawImage("Icons/Bondage.png", panelX, y - 20);
	MainCanvas.fillText(ActorGetValue(ActorBondageCount).toString(), panelX + 90, y);
}

function DrawIntro(Intro, CurrentStagePosition, LoveLevel, SubLevel) {
	DrawRect(0, UI_BOTTOM_Y, UI_W, UI_BOTTOM_H, "rgba(255,255,255,0.92)");
	DrawRect(0, UI_BOTTOM_Y, UI_W, 2, "black");
	var ShowText = "";
	if (OverridenIntroText != "")
		ShowText = OverridenIntroText;
	else if (Intro != null)
		for (var I = 0; I < Intro.length; I++)
			if (Intro[I][IntroStage] == CurrentStagePosition)
				if (ActorInteractionAvailable(Intro[I][IntroLoveReq], Intro[I][IntroSubReq], Intro[I][IntroVarReq], Intro[I][IntroText], true))
					ShowText = Intro[I][IntroText];
	MainCanvas.font = UI_FONT;
	MainCanvas.fillStyle = "black";
	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";
	if (ShowText.indexOf("|") == -1)
		MainCanvas.fillText(ShowText, 40, UI_BOTTOM_Y + UI_BOTTOM_H / 2);
	else {
		MainCanvas.fillText(ShowText.substring(0, ShowText.indexOf("|")), 40, UI_BOTTOM_Y + UI_BOTTOM_H / 2 - 28);
		MainCanvas.fillText(ShowText.substring(ShowText.indexOf("|") + 1, 1000), 40, UI_BOTTOM_Y + UI_BOTTOM_H / 2 + 28);
	}
	DrawActorStatsBar();
}

function DrawOption(OptionText, Index) {
	if (OptionText.substr(0, 1) == "@") OptionText = OptionText.substr(1);
	var Left = UI_OPT_X;
	var Top = UI_OPT_TOP + Index * (UI_OPT_H + UI_OPT_GAP);
	DrawRect(Left, Top, UI_OPT_W, UI_OPT_H, "rgba(20,20,20,0.35)");
	MainCanvas.strokeStyle = "rgba(255,255,255,0.25)";
	MainCanvas.lineWidth = 2;
	MainCanvas.strokeRect(Left, Top, UI_OPT_W, UI_OPT_H);
	var hover = (MouseX >= Left) && (MouseX <= Left + UI_OPT_W) && (MouseY >= Top) && (MouseY <= Top + UI_OPT_H) && !IsMobile;
	MainCanvas.font = UI_FONT_SM;
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";
	MainCanvas.fillStyle = hover ? "#7CFF7C" : "#FFFFFF";
	MainCanvas.fillText(OptionText, Left + UI_OPT_W / 2, Top + UI_OPT_H / 2);
}

function GetAvailableOptions(Stage, CurrentStagePosition) {
	var list = [];
	for (var S = 0; S < Stage.length; S++)
		if (Stage[S][StageNumber] == CurrentStagePosition)
			if (ActorInteractionAvailable(Stage[S][StageLoveReq], Stage[S][StageSubReq], Stage[S][StageVarReq], Stage[S][StageInteractionText], false))
				list.push(Stage[S]);
	return list;
}

function DrawInteraction(Stage, CurrentStagePosition, LoveLevel, SubLevel) {
	var list = GetAvailableOptions(Stage, CurrentStagePosition);
	var total = list.length;
	var maxPage = Math.max(0, Math.ceil(total / 4) - 1);
	if (InteractionOptionPage > maxPage) InteractionOptionPage = maxPage;
	if (InteractionOptionPage < 0) InteractionOptionPage = 0;

	var start = InteractionOptionPage * 4;
	var show = list.slice(start, start + 4);
	for (var i = 0; i < show.length; i++)
		DrawOption(show[i][StageInteractionText], i);

	// 5th slot: Next / Back when more than 4 options
	if (total > 4) {
		if (InteractionOptionPage < maxPage)
			DrawOption("@Next →", 4);
		else if (InteractionOptionPage > 0)
			DrawOption("@← Back", 4);
		else
			DrawOption("@Next →", 4);
	}
}

function FindImage(Intro, CurrentStagePosition) {
	var ImageName = "";
	if (OverridenIntroImage != "")
		ImageName = OverridenIntroImage;
	else if (Intro != null)
		for (var I = 0; I < Intro.length; I++)
			if (Intro[I][IntroStage] == CurrentStagePosition)
				if (ActorInteractionAvailable(Intro[I][IntroLoveReq], Intro[I][IntroSubReq], Intro[I][IntroVarReq], Intro[I][IntroText], true))
					ImageName = Intro[I][IntroImage];
	return ImageName;
}

function BuildInteraction(CurrentStagePosition) {
	if ((CurrentIntro != null) && (CurrentStage != null)) {
		var ImageName = FindImage(CurrentIntro, CurrentStagePosition);
		if ((ImageName !== undefined) && (ImageName.trim() != ""))
			DrawImage(CurrentChapter + "/" + CurrentScreen + "/" + ImageName, 0, 0);
		else
			DrawRect(0, 0, UI_W, UI_H, "#222222");
		DrawInteraction(CurrentStage, CurrentStagePosition, 0, 0);
		DrawIntro(CurrentIntro, CurrentStagePosition, 0, 0);
	}
}

function GetPlayerIconImage() {
	var Image = "Player";
	var seconds = new Date().getTime();
	if (PlayerHasLockedInventory("BallGag") == true) Image = Image + "_BallGag";
    if (PlayerHasLockedInventory("TapeGag") == true) Image = Image + "_TapeGag";
    if (PlayerHasLockedInventory("ClothGag") == true) Image = Image + "_ClothGag";
    if (PlayerHasLockedInventory("DoubleOpenGag") == true) Image = Image + "_DoubleOpenGag";
    if (PlayerHasLockedInventory("RingGag") == true) Image = Image + "_RingGag";
    if (PlayerHasLockedInventory("Blindfold") == true) Image = Image + "_Blindfold";
    if (PlayerHasLockedInventory("Hood") == true) Image = Image + "_Hood";
	if (Math.round(seconds / 500) % 15 == 0) Image = Image + "_Blink";
	return Image;
}

function DrawInventory() {
	var iconY = 5;
	if (typeof PlayerInventoryScroll === "undefined") PlayerInventoryScroll = 0;
	if (typeof PlayerInventoryVisible === "undefined") PlayerInventoryVisible = 12;

	// Build display list (permanent collection)
	var display = [];
	for (var I = 0; I < PlayerInventory.length; I++)
		display.push(PlayerInventory[I][PlayerInventoryName]);
	for (var L = 0; L < PlayerLockedInventory.length; L++)
		if (!PlayerHasInventory(PlayerLockedInventory[L]))
			display.push(PlayerLockedInventory[L]);

	var maxScroll = Math.max(0, display.length - PlayerInventoryVisible);
	if (PlayerInventoryScroll > maxScroll) PlayerInventoryScroll = maxScroll;
	if (PlayerInventoryScroll < 0) PlayerInventoryScroll = 0;

	// Left arrow
	var canLeft = PlayerInventoryScroll > 0;
	var leftState = "Inactive";
	if (canLeft && (((MouseX >= 4) && (MouseX <= 4 + UI_ICON) && (MouseY >= 0) && (MouseY <= UI_TOP_H)) || IsMobile)) leftState = "Active";
	if (canLeft) {
		if (typeof Icons !== "undefined" && Icons.Navigation)
			DrawImage(Icons.Navigation.ArrowLeftActive.replace("Active", leftState) + ".png", 4, iconY);
		else {
			MainCanvas.font = "40px Arial";
			MainCanvas.fillStyle = canLeft ? (leftState == "Active" ? "#00AA00" : "#000") : "#AAA";
			MainCanvas.textAlign = "center";
			MainCanvas.fillText("◀", 4 + UI_ICON / 2, iconY + UI_ICON / 2);
		}
	}

	// Visible items
	for (var i = 0; i < PlayerInventoryVisible; i++) {
		var idx = i + PlayerInventoryScroll;
		if (idx >= display.length) break;
		var name = display[idx];
		var slotX = 4 + (i + 1) * UI_ICON;
		var ImgState = "Inactive";
		if (((MouseX >= slotX) && (MouseX <= slotX + UI_ICON - 1) && (MouseY >= 0) && (MouseY <= UI_TOP_H)) || IsMobile) ImgState = "Active";
		DrawImage("Icons/" + name + "_" + ImgState + ".png", slotX, iconY);
		if (PlayerHasLockedInventory(name))
			DrawImage("Icons/Lock_" + ImgState + ".png", slotX, iconY);
	}

	// Right arrow
	var canRight = PlayerInventoryScroll < maxScroll;
	var rightX = 4 + (PlayerInventoryVisible + 1) * UI_ICON;
	var rightState = "Inactive";
	if (canRight && (((MouseX >= rightX) && (MouseX <= rightX + UI_ICON) && (MouseY >= 0) && (MouseY <= UI_TOP_H)) || IsMobile)) rightState = "Active";
	if (canRight) {
		if (typeof Icons !== "undefined" && Icons.Navigation)
			DrawImage(Icons.Navigation.ArrowRightActive.replace("Active", rightState) + ".png", rightX, iconY);
		else {
			MainCanvas.font = "40px Arial";
			MainCanvas.fillStyle = canRight ? (rightState == "Active" ? "#00AA00" : "#000") : "#AAA";
			MainCanvas.textAlign = "center";
			MainCanvas.fillText("▶", rightX + UI_ICON / 2, iconY + UI_ICON / 2);
		}
	}

	if (typeof PlayerSkillShowLevelUp !== "undefined" && PlayerSkillShowLevelUp > 0)
		DrawImage("Icons/SkillLevelUp.png", 4 + UI_ICON, iconY);
}

// Left floating icons = items usable in this scene (phone / rope / key style)
function DrawUsableItems() {
	if (typeof GetUsableInventoryItems !== "function") return;
	var usable = GetUsableInventoryItems();
	if (!usable || usable.length == 0) return;

	var leftX = 12;
	var leftTop = UI_TOP_H + 20;
	var gap = 12;
	for (var u = 0; u < usable.length && u < 8; u++) {
		var name = usable[u];
		var uy = leftTop + u * (UI_ICON + gap);
		var ImgState = "Inactive";
		if (((MouseX >= leftX) && (MouseX <= leftX + UI_ICON) && (MouseY >= uy) && (MouseY <= uy + UI_ICON)) || IsMobile)
			ImgState = "Active";
		// soft circle behind icon (like the phone reference)
		MainCanvas.beginPath();
		MainCanvas.arc(leftX + UI_ICON / 2, uy + UI_ICON / 2, UI_ICON / 2 + 6, 0, Math.PI * 2);
		MainCanvas.fillStyle = (ImgState == "Active") ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)";
		MainCanvas.fill();
		MainCanvas.closePath();
		DrawImage("Icons/" + name + "_" + ImgState + ".png", leftX, uy);
		if (PlayerHasLockedInventory(name))
			DrawImage("Icons/Lock_" + ImgState + ".png", leftX, uy);
	}
}

// ===== Stats panel (character love / dom-sub overview) =====
var StatsPanelOpen = false;
var StatsPanelScroll = 0;
var STATS_BTN_W = 110;
var STATS_BTN_H = 70;
// Place Stats button on the top bar, right side of inventory area / left of day text
var STATS_BTN_X = UI_W - 430;
var STATS_BTN_Y = 15;

function DrawStatsButton() {
	var hover = ((MouseX >= STATS_BTN_X) && (MouseX <= STATS_BTN_X + STATS_BTN_W) &&
		(MouseY >= STATS_BTN_Y) && (MouseY <= STATS_BTN_Y + STATS_BTN_H)) || IsMobile;
	DrawRect(STATS_BTN_X, STATS_BTN_Y, STATS_BTN_W, STATS_BTN_H, hover ? "rgba(200,80,120,0.85)" : "rgba(40,30,50,0.85)");
	MainCanvas.strokeStyle = hover ? "rgba(255,200,220,0.9)" : "rgba(200,100,140,0.55)";
	MainCanvas.lineWidth = 2;
	MainCanvas.strokeRect(STATS_BTN_X, STATS_BTN_Y, STATS_BTN_W, STATS_BTN_H);
	MainCanvas.font = "28px Arial";
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";
	MainCanvas.fillText((typeof CurrentLanguageTag !== "undefined" && CurrentLanguageTag == "CN") ? "状态" : "Stats",
		STATS_BTN_X + STATS_BTN_W / 2, STATS_BTN_Y + STATS_BTN_H / 2);
}

// Profile portrait path: Actors/{Name}/Profile.png
function GetActorProfilePath(actorName) {
	if (!actorName) return "";
	if (actorName == "Player" || actorName == Common_PlayerName) return "Actors/Player/Profile.png";
	return "Actors/" + actorName + "/Profile.png";
}

function DrawStatsPanel() {
	if (!StatsPanelOpen) return;

	// Dim background
	DrawRect(0, 0, UI_W, UI_H, "rgba(0,0,0,0.55)");

	var panelW = 1600;
	var panelH = 1080;
	var panelX = Math.floor((UI_W - panelW) / 2);
	var panelY = 50;

	DrawRect(panelX, panelY, panelW, panelH, "rgb(28,18,36)");
	MainCanvas.strokeStyle = "rgba(200,100,140,0.7)";
	MainCanvas.lineWidth = 3;
	MainCanvas.strokeRect(panelX, panelY, panelW, panelH);

	// Title
	MainCanvas.font = "40px Arial";
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.textAlign = "left";
	MainCanvas.textBaseline = "middle";
	MainCanvas.fillText((typeof CurrentLanguageTag !== "undefined" && CurrentLanguageTag == "CN") ? "角色状态" : "Character Stats", panelX + 36, panelY + 42);

	// Close hint
	MainCanvas.font = "24px Arial";
	MainCanvas.fillStyle = "rgba(255,255,255,0.65)";
	MainCanvas.textAlign = "right";
	MainCanvas.fillText((typeof CurrentLanguageTag !== "undefined" && CurrentLanguageTag == "CN") ? "点击关闭" : "Click to close", panelX + panelW - 36, panelY + 42);

	// Build display list: Player first, then met actors
	var list = [];
	list.push({ name: "Player", love: null, sub: null, isPlayer: true, link: "" });
	if (typeof Actor !== "undefined" && Actor) {
		for (var i = 0; i < Actor.length; i++) {
			var a = Actor[i];
			var name = a[ActorName] || ("#" + i);
			if (name == "Player") continue;
			var link = "";
			if (typeof Common_PlayerLover !== "undefined" && Common_PlayerLover == name) link = (CurrentLanguageTag == "CN") ? "恋人" : "Lover";
			else if (typeof Common_PlayerOwner !== "undefined" && Common_PlayerOwner == name) link = (CurrentLanguageTag == "CN") ? "主人" : "Owner";
			else if (a[ActorOwner] == "Player") link = (CurrentLanguageTag == "CN") ? "你的" : "Owned";
			list.push({
				name: name,
				love: a[ActorLove] || 0,
				sub: a[ActorSubmission] || 0,
				isPlayer: false,
				link: link
			});
		}
	}

	// Card grid
	var cols = 4;
	var cardW = 360;
	var cardH = 460;
	var gapX = 24;
	var gapY = 20;
	var gridLeft = panelX + 40;
	var gridTop = panelY + 90;
	var maxCards = cols * 2; // 2 rows visible
	if (StatsPanelScroll < 0) StatsPanelScroll = 0;
	var maxScroll = Math.max(0, list.length - maxCards);
	if (StatsPanelScroll > maxScroll) StatsPanelScroll = maxScroll;

	for (var c = 0; c < maxCards; c++) {
		var idx = StatsPanelScroll + c;
		if (idx >= list.length) break;
		var item = list[idx];
		var col = c % cols;
		var row = Math.floor(c / cols);
		var cx = gridLeft + col * (cardW + gapX);
		var cy = gridTop + row * (cardH + gapY);

		// Card background
		DrawRect(cx, cy, cardW, cardH, "rgba(255,255,255,0.06)");
		MainCanvas.strokeStyle = "rgba(200,100,140,0.35)";
		MainCanvas.lineWidth = 2;
		MainCanvas.strokeRect(cx, cy, cardW, cardH);

		// Portrait area
		var porW = 220;
		var porH = 300;
		var porX = cx + Math.floor((cardW - porW) / 2);
		var porY = cy + 16;
		DrawRect(porX, porY, porW, porH, "rgba(0,0,0,0.35)");

		var profilePath = GetActorProfilePath(item.name);
		var img = DrawGetImage(profilePath);
		if (img && img.complete && img.naturalWidth > 0) {
			try {
				// Cover-fit into portrait box (crop sides if needed)
				var iw = img.naturalWidth;
				var ih = img.naturalHeight;
				var scale = Math.max(porW / iw, porH / ih);
				var sw = porW / scale;
				var sh = porH / scale;
				var sx = Math.max(0, (iw - sw) / 2);
				var sy = Math.max(0, (ih - sh) * 0.12); // slight top bias
				MainCanvas.drawImage(img, sx, sy, sw, sh, porX, porY, porW, porH);
			} catch (e) {}
		} else {
			MainCanvas.font = "22px Arial";
			MainCanvas.fillStyle = "rgba(255,255,255,0.4)";
			MainCanvas.textAlign = "center";
			MainCanvas.textBaseline = "middle";
			MainCanvas.fillText("?", porX + porW / 2, porY + porH / 2);
		}

		// Name
		var displayName = item.isPlayer
			? ((typeof Common_PlayerName !== "undefined" && Common_PlayerName) ? Common_PlayerName : "Player")
			: item.name;
		MainCanvas.font = "26px Arial";
		MainCanvas.fillStyle = "#ffffff";
		MainCanvas.textAlign = "center";
		MainCanvas.textBaseline = "middle";
		MainCanvas.fillText(String(displayName), cx + cardW / 2, cy + 330);

		// Stats under portrait
		if (item.isPlayer) {
			MainCanvas.font = "22px Arial";
			MainCanvas.fillStyle = "rgba(255,255,255,0.55)";
			MainCanvas.fillText((CurrentLanguageTag == "CN") ? "你" : "You", cx + cardW / 2, cy + 368);
		} else {
			MainCanvas.font = "22px Arial";
			MainCanvas.textAlign = "left";
			MainCanvas.fillStyle = "rgba(255,200,220,0.8)";
			MainCanvas.fillText((CurrentLanguageTag == "CN") ? "好感" : "Love", cx + 28, cy + 365);
			MainCanvas.fillStyle = (item.love > 0) ? "#7CFF7C" : ((item.love < 0) ? "#FF7C7C" : "#cccccc");
			MainCanvas.textAlign = "right";
			MainCanvas.fillText((item.love > 0 ? "+" : "") + String(item.love), cx + cardW - 28, cy + 365);

			MainCanvas.textAlign = "left";
			MainCanvas.fillStyle = "rgba(255,200,220,0.8)";
			MainCanvas.fillText((CurrentLanguageTag == "CN") ? "支配/服从" : "Dom/Sub", cx + 28, cy + 400);
			MainCanvas.fillStyle = (item.sub > 0) ? "#7CC8FF" : ((item.sub < 0) ? "#FFB07C" : "#cccccc");
			MainCanvas.textAlign = "right";
			MainCanvas.fillText((item.sub > 0 ? "+" : "") + String(item.sub), cx + cardW - 28, cy + 400);

			if (item.link) {
				MainCanvas.font = "20px Arial";
				MainCanvas.fillStyle = "#e8c0d0";
				MainCanvas.textAlign = "center";
				MainCanvas.fillText(item.link, cx + cardW / 2, cy + 436);
			}
		}
	}

	// Scroll hint
	if (list.length > maxCards) {
		MainCanvas.font = "22px Arial";
		MainCanvas.fillStyle = "rgba(255,255,255,0.5)";
		MainCanvas.textAlign = "center";
		MainCanvas.fillText((StatsPanelScroll + 1) + "–" + Math.min(StatsPanelScroll + maxCards, list.length) + " / " + list.length, panelX + panelW / 2, panelY + panelH - 24);
	}
}

function StatsButtonClick() {
	if (!((MouseX >= STATS_BTN_X) && (MouseX <= STATS_BTN_X + STATS_BTN_W) &&
		(MouseY >= STATS_BTN_Y) && (MouseY <= STATS_BTN_Y + STATS_BTN_H))) return false;
	StatsPanelOpen = !StatsPanelOpen;
	if (StatsPanelOpen) StatsPanelScroll = 0;
	return true;
}

function StatsPanelClick() {
	if (!StatsPanelOpen) return false;
	// Any click closes the panel (simple UX)
	StatsPanelOpen = false;
	return true;
}

function BuildBottomBar() {
	// Hide collection / day UI during pure C000 menu & intro screens
	var hideChrome = (CurrentChapter == "C000_Intro" &&
		(CurrentScreen == "Intro" || CurrentScreen == "ChapterSelect" || CurrentScreen == "CreatePlayer"));
	if (hideChrome) return;

	// Top collection bar
	DrawRect(0, 0, UI_W, UI_TOP_H, "rgba(255,255,255,0.90)");
	DrawRect(0, UI_TOP_H - 1, UI_W, 1, "black");
	DrawInventory();
	DrawStatsButton();
	if (typeof CurrentDay !== "undefined" && typeof GetCurrentTimeString === "function") {
		MainCanvas.font = "26px Arial";
		MainCanvas.fillStyle = "black";
		MainCanvas.textAlign = "right";
		MainCanvas.fillText("Day " + CurrentDay + "  " + GetCurrentTimeString(), UI_W - 180, UI_TOP_H / 2);
	}
	if (LeaveIcon != "") {
		if (((MouseX >= UI_W - 100) && (MouseX <= UI_W) && (MouseY >= 0) && (MouseY <= UI_TOP_H)) || (IsMobile))
			DrawImage("Icons/" + LeaveIcon + "_Active.png", UI_W - 96, 8);
		else
			DrawImage("Icons/" + LeaveIcon + "_Inactive.png", UI_W - 96, 8);
	}
	// Left floating "use now" icons
	DrawUsableItems();

	// Stats overlay on top of everything in the chrome pass
	DrawStatsPanel();
}

function DrawGetPlayerImageName(IncludePose) {
	var ImageName = "";
	if (Common_PlayerCloth != "") ImageName = Common_PlayerCloth;
	else ImageName = "Clothed";
	if (PlayerHasLockedInventory("Cuffs")) ImageName = ImageName + "_Cuffs";
	else if (PlayerHasLockedInventory("Rope")) ImageName = ImageName + "_Rope";
	else if (PlayerHasLockedInventory("Armbinder")) ImageName = ImageName + "_Armbinder";
	else if (PlayerHasLockedInventory("Manacles")) ImageName = ImageName + "_Manacles";
	else if (PlayerHasLockedInventory("Hogtie")) ImageName = ImageName + "_Hogtie";
	else if (PlayerHasLockedInventory("Straitjacket")) ImageName = ImageName + "_Straitjacket";
	else ImageName = ImageName + "_NoBondage";
	if (PlayerHasLockedInventory("Collar") || PlayerHasLockedInventory("PermanentCollar") || PlayerHasLockedInventory("PadlockedCollar")) ImageName = ImageName + "_Collar";
	if (PlayerHasLockedInventory("BallGag")) ImageName = ImageName + "_BallGag";
	else if (PlayerHasLockedInventory("TapeGag")) ImageName = ImageName + "_TapeGag";
	else if (PlayerHasLockedInventory("ClothGag")) ImageName = ImageName + "_ClothGag";
	else if (PlayerHasLockedInventory("RingGag")) ImageName = ImageName + "_RingGag";
	else ImageName = ImageName + "_NoGag";
	if (IncludePose && (Common_PlayerPose != "")) ImageName = ImageName + "_" + Common_PlayerPose;
	return ImageName;
}

function DrawPlayerImage(X, Y) {
	if ((X == null) || (Y == null))
		DrawTransparentPlayerImage(0, UI_TOP_H, 1.6);
	else
		DrawImageZoom("C999_Common/Player/" + DrawGetPlayerImageName(false) + ".jpg", X, Y, 600, 600, 0, UI_TOP_H, UI_W, UI_BOTTOM_Y - UI_TOP_H);
}

function DrawTransparentPlayerImage(X, Y, Zoom) {
	DrawImageZoom("Actors/Player/" + DrawGetPlayerImageName(true) + ".png", 0, 0, 600, 900, X, Y, 600 * Zoom, 900 * Zoom);
}

function DrawActor(ActorToDraw, X, Y, Zoom) {
	var ImageCloth = ActorSpecificGetValue(ActorToDraw, ActorCloth);
	if ((ImageCloth == null) || (ImageCloth == "")) ImageCloth = "Clothed";
	var ImageBondage = "_NoBondage";
	if (ActorSpecificHasInventory(ActorToDraw, "Cuffs")) ImageBondage = "_Cuffs";
	else if (ActorSpecificHasInventory(ActorToDraw, "Rope") || ActorSpecificHasInventory(ActorToDraw, "TwoRopes") || ActorSpecificHasInventory(ActorToDraw, "ThreeRopes")) ImageBondage = "_Rope";
	else if (ActorSpecificHasInventory(ActorToDraw, "Armbinder")) ImageBondage = "_Armbinder";
	else if (ActorSpecificHasInventory(ActorToDraw, "Manacles")) ImageBondage = "_Manacles";
	else if (ActorSpecificHasInventory(ActorToDraw, "Hogtie")) ImageBondage = "_Hogtie";
	else if (ActorSpecificHasInventory(ActorToDraw, "Straitjacket")) ImageBondage = "_Straitjacket";
	var ImageCollar = "";
	if (ActorSpecificHasInventory(ActorToDraw, "Collar") || ActorSpecificHasInventory(ActorToDraw, "PermanentCollar") || ActorSpecificHasInventory(ActorToDraw, "PadlockedCollar"))
		ImageCollar = "_Collar";
	var ImageGag = "_NoGag";
	if (ActorSpecificHasInventory(ActorToDraw, "BallGag")) ImageGag = "_BallGag";
	else if (ActorSpecificHasInventory(ActorToDraw, "TapeGag")) ImageGag = "_TapeGag";
	else if (ActorSpecificHasInventory(ActorToDraw, "ClothGag")) ImageGag = "_ClothGag";
	else if (ActorSpecificHasInventory(ActorToDraw, "RingGag")) ImageGag = "_RingGag";
	else if (ActorSpecificHasInventory(ActorToDraw, "MuzzleGag")) ImageGag = "_MuzzleGag";
	var ImageBlindfold = "";
	if (ActorSpecificHasInventory(ActorToDraw, "Blindfold")) ImageBlindfold = "_Blindfold";
	else if (ActorSpecificHasInventory(ActorToDraw, "Hood")) ImageBlindfold = "_Hood";
	var ImagePose = "";
	var Pose = ActorSpecificGetValue(ActorToDraw, ActorPose);
	if ((Pose != null) && (Pose != "")) ImagePose = "_" + Pose;
	DrawImageZoom("Actors/" + ActorToDraw + "/" + ImageCloth + ImageBondage + ImageCollar + ImageGag + ImageBlindfold + ImagePose + ".png", 0, 0, 600, 900, X, Y, 600 * Zoom, 900 * Zoom);
}

function DrawInteractionActor() {
	if (CurrentActor == "")
		DrawTransparentPlayerImage(400, UI_TOP_H, 1.4);
	else
		DrawActor(CurrentActor, 400, UI_TOP_H, 1.4);
}

// Intro transition frames: Actors/PlayerTransition/Player01.png … Player08.png
// Accepts any source size (768x768, 300x600, etc.) and scales into the target box
var PlayerTransitionFrame = 1;
var PlayerTransitionAutoTimer = 0;
var PlayerTransitionAutoInterval = 45; // frames between auto-advance (~0.75s at 60fps-ish MainRun)

function DrawPlayerTransition(Frame, Opt) {
	var f = Frame;
	if (f == null || f === undefined) f = PlayerTransitionFrame;
	f = Math.max(1, Math.min(8, parseInt(f) || 1));
	PlayerTransitionFrame = f;
	var src = "Actors/PlayerTransition/Player0" + f + ".png";
	var img = DrawGetImage(src);

	// Layout box (defaults: main area under top bar; CreatePlayer can pass a right-side box)
	var boxX = (Opt && Opt.x != null) ? Opt.x : 0;
	var boxY = (Opt && Opt.y != null) ? Opt.y : UI_TOP_H;
	var boxW = (Opt && Opt.w != null) ? Opt.w : UI_W;
	var boxH = (Opt && Opt.h != null) ? Opt.h : (UI_BOTTOM_Y - UI_TOP_H);
	// Keep a margin so character isn't edge-clipped
	var pad = (Opt && Opt.pad != null) ? Opt.pad : 20;
	var maxW = Math.max(100, boxW - pad * 2);
	var maxH = Math.max(100, boxH - pad * 2);

	var iw = (img && img.complete && img.naturalWidth) ? img.naturalWidth : ((img && img.width) ? img.width : 768);
	var ih = (img && img.complete && img.naturalHeight) ? img.naturalHeight : ((img && img.height) ? img.height : 768);
	if (!iw || !ih) { iw = 768; ih = 768; }

	// Three-quarter / portrait friendly: fit by height so the upper body
	// fills the frame; center horizontally; slight top bias.
	var scale = Math.min(maxW / iw, maxH / ih);
	if (ih >= iw * 1.15) {
		scale = Math.min(maxW / iw, (maxH * 1.02) / ih);
		if (scale * iw > maxW) scale = maxW / iw;
	}
	var dw = Math.round(iw * scale);
	var dh = Math.round(ih * scale);
	var dx = boxX + Math.floor((boxW - dw) / 2);
	var dy = boxY + Math.max(pad, Math.floor((boxH - dh) * 0.18));
	if (dy + dh > boxY + boxH - pad) dy = boxY + boxH - pad - dh;
	if (dy < boxY + pad) dy = boxY + pad;

	if (img && img.complete && img.naturalWidth > 0) {
		try {
			MainCanvas.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
		} catch (e) {
			try { MainCanvas.drawImage(img, dx, dy, dw, dh); } catch (e2) {}
		}
	}
}

// Auto-cycle Player01–08 (used on Intro screens)
function AdvancePlayerTransitionAuto() {
	PlayerTransitionAutoTimer++;
	if (PlayerTransitionAutoTimer >= PlayerTransitionAutoInterval) {
		PlayerTransitionAutoTimer = 0;
		PlayerTransitionFrame = (PlayerTransitionFrame % 8) + 1;
	}
	return PlayerTransitionFrame;
}

function GetIconScreenPath(IconName) {
	return "Icons/" + IconName + ".png";
}
