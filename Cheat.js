var CheatAllow = false;
var TranslationCheatAllow = false;
var TranslationCacheCounter = 0;
var TranslationCurrentText = 0;
var TranslationCurrentStageFileLine = 0;
var TranslationSavedStage;

// Receives cheat keys
function CheatKey() {

	// No cheats until the player has a name
	if (Common_PlayerName != "") {
		// In a fight or a race, the user can press * to win automatically
		if (!FightEnded && (FightTimer > 0)) { if (KeyPress == 42) FightEnd(true); return; }
		if (!DoubleFightEnded && (DoubleFightTimer > 0)) { if (KeyPress == 42) DoubleFightEnd(true); return; }
		if (!RaceEnded && (RaceTimer > 0)) { if (KeyPress == 42) { RaceProgress = RaceGoal; RaceEnd(true); } return; }
		if (!QuizEnded && (QuizTimer > 0) && (QuizBetweenQuestionTimer == 0) && (QuizAnswerText == "")) { if (KeyPress == 42) { QuizAnswerText = QuizQuestion[QuizProgressLeft + QuizProgressRight][QuizQuestionAnswer1]; QuizAnswerBy = "Left"; QuizProgressLeft++; QuizBetweenQuestionTimer = QuizTimer + QuizOtherQuestionTime; } return; }

		// Time +/- (15 minutes)
		if (KeyPress == 43) CheatTime(900000);
		if (KeyPress == 45) CheatTime(-900000);

		// Actor love/sub
		if (CurrentActor != "") CheatActor();

		// Global release (*) when restrained
		CheatRelease();

		// Day skip (0 = next day)
		if (KeyPress == 48) StartNewDay();

		if (TranslationCheatAllow) CheatTranslation(); else CheatSkill();
		CheatInventory();
	}

}

// Cheats the clock by adding or removing time
function CheatTime(TimeChange) {

	if (RunTimer) {
		CurrentTime = CurrentTime + TimeChange;
		if (CurrentTime <= 0) CurrentTime = 1;

		// Also shift minute-based clock (Time.js remake)
		if (typeof CurrentMinute !== "undefined") {
			var deltaMin = Math.round(TimeChange / 60000);
			AddMinutes(deltaMin);
		}

		for (var L = 0; L < GameLog.length; L++)
			if (GameLog[L][GameLogTimer] > 0) {
				GameLog[L][GameLogTimer] = GameLog[L][GameLogTimer] + TimeChange;
				if (GameLog[L][GameLogTimer] <= 0) GameLog[L][GameLogTimer] = 1;
				if (GameLog[L][GameLogTimer] > 24 * 60 * 60 * 1000) GameLog[L][GameLogTimer] = 24 * 60 * 60 * 1000;
			}
	}

}

// Cheats to change actor love or submission (1-4)
function CheatActor() {
	if (KeyPress == 49) ActorChangeAttitude(1, 0);
	if (KeyPress == 50) ActorChangeAttitude(-1, 0);
	if (KeyPress == 51) ActorChangeAttitude(0, 1);
	if (KeyPress == 52) ActorChangeAttitude(0, -1);
}

// Cheats to gain a skill (5-9)
function CheatSkill() {
	if (KeyPress == 53) PlayerAddSkill("Arts", 1);
	if (KeyPress == 54) PlayerAddSkill("Fighting", 1);
	if (KeyPress == 55) PlayerAddSkill("RopeMastery", 1);
	if (KeyPress == 56) PlayerAddSkill("Seduction", 1);
	if (KeyPress == 57) PlayerAddSkill("Sports", 1);
}

// Global release cheat (*)
function CheatRelease() {
	if (KeyPress == 42) {
		PlayerReleaseBondage();
		if (PlayerHasLockedInventory("ChastityBelt")) { PlayerUnlockInventory("ChastityBelt"); PlayerAddInventory("ChastityBelt", 1); }
		if (PlayerHasLockedInventory("VibratingEgg")) { PlayerUnlockInventory("VibratingEgg"); PlayerAddInventory("VibratingEgg", 1); }
		if (PlayerHasLockedInventory("ButtPlug")) { PlayerUnlockInventory("ButtPlug"); PlayerAddInventory("ButtPlug", 1); }
		PlayerUnblindfold();
	}
}

// Cheats used for text editing a translation
function CheatTranslation(){
	let stageTexts = CurrentStage;
	let texts = CurrentText;
	let screenPath = CurrentChapter + "_" + CurrentScreen;
	let displayedStageNumber;

	switch (KeyPress){
		case 47:
			let language = GetWorkingLanguage();
			let fileTypes = ["Intro","Stage","Text"];
			for(var c in fileTypes){
				var cachePath = CurrentChapter + "/" + CurrentScreen + "/" + fileTypes[c] + (language ? ("_" + language) : "") + ".csv"
				if(CSVCache[cachePath]) delete CSVCache[cachePath];
			}
			TranslationCacheCounter++;
			if(CurrentIntro !== null && CurrentStage !== null){
				LoadInteractions();
			} else if(CurrentText !== null){
				LoadText();
			}
			break;
		case 54:
		case 57:
			if(texts && texts.length > 1){
				if(KeyPress === 57) TranslationCurrentText--; else TranslationCurrentText++;
				TranslationCurrentText = Math.min(texts.length - 1, Math.max(1, TranslationCurrentText));
				let displayText = texts[TranslationCurrentText][TextContent].trim();
				if(displayText !== "") OverridenIntroText = displayText; else OverridenIntroText = "** Text is empty";
			}
			break;
		case 53:
		case 56:
			if (!TranslationSavedStage || TranslationSavedStage.screen !== screenPath) {
				TranslationSavedStage = {
					stage: window[screenPath + "_CurrentStage"],
					screen: screenPath,
					overridenText: OverridenIntroText
				};
				TranslationCurrentStageFileLine = 1;
			}

			if(stageTexts && stageTexts.length > 1){
				if(KeyPress === 56) TranslationCurrentStageFileLine--; else TranslationCurrentStageFileLine++;
				TranslationCurrentStageFileLine = Math.min(stageTexts.length - 1, Math.max(1, TranslationCurrentStageFileLine));
				let displayText = stageTexts[TranslationCurrentStageFileLine][StageInteractionResult].trim();
				displayedStageNumber = stageTexts[TranslationCurrentStageFileLine][StageNumber];
				if(displayText !== "") OverridenIntroText = displayText; else OverridenIntroText = "** Stage has empty interaction result";
				window[screenPath + "_CurrentStage"] = displayedStageNumber;
				console.log("Stage: " + displayedStageNumber + " Line: " + (TranslationCurrentStageFileLine + 1));
			}
			break;
		case 55:
			OverridenIntroText = "";
			break;
		case 61:
			if(TranslationSavedStage) {
				window[screenPath + "_CurrentStage"] = TranslationSavedStage.stage
				OverridenIntroText = TranslationSavedStage.overridenText
				TranslationSavedStage = undefined;
			}
			break;
		case 46:
			TranslationCurrentStageFileLine = Math.min(stageTexts.length - 1, Math.max(1, TranslationCurrentStageFileLine));
			displayedStageNumber = stageTexts[TranslationCurrentStageFileLine][StageNumber];
			if(typeof displayedStageNumber !== undefined){
				var flipped = {};
				for(var i in stageTexts){
					let prereqVarname = stageTexts[i][StageVarReq].trim();
					if(stageTexts[i][StageNumber] === displayedStageNumber && prereqVarname !== ""){
						let toFlip = "";
						if(prereqVarname.substring(0,1) == "!") prereqVarname = prereqVarname.substring(1);
						if(prereqVarname.substring(0,7) == "Common_"){
							toFlip = prereqVarname;
						}
						else {
							toFlip = screenPath + "_" + prereqVarname;
						}
						if(toFlip && !flipped[toFlip]){
							window[toFlip] = !window[toFlip];
							flipped[toFlip] = true;
							console.log("Flipped " + toFlip);
						}
					}
				}
			}
			break;
	}
}

// Cheats to add inventory (letter keys)
function CheatInventory() {
	if ((KeyPress == 65) || (KeyPress == 97)) PlayerAddInventory("Armbinder", 1);
	if ((KeyPress == 66) || (KeyPress == 98)) PlayerAddInventory("BallGag", 1);
	if ((KeyPress == 67) || (KeyPress == 99)) PlayerAddInventory("Cuffs", 1);
	if ((KeyPress == 70) || (KeyPress == 102)) PlayerAddInventory("ChastityBelt", 1);
	if ((KeyPress == 71) || (KeyPress == 103)) PlayerAddInventory("ClothGag", 1);
	if ((KeyPress == 72) || (KeyPress == 104)) PlayerAddInventory("Hood", 1);			// H = Hood
	if ((KeyPress == 75) || (KeyPress == 107)) PlayerAddInventory("CuffsKey", 1);
	if ((KeyPress == 76) || (KeyPress == 108)) PlayerAddInventory("Collar", 1);
	if ((KeyPress == 77) || (KeyPress == 109)) PlayerAddInventory("Mitts", 1);			// M = Mitts
	if ((KeyPress == 78) || (KeyPress == 110)) PlayerAddInventory("NippleClamps", 1);	// N
	if ((KeyPress == 80) || (KeyPress == 112)) PlayerAddInventory("Crop", 1);
	if ((KeyPress == 81) || (KeyPress == 113)) PlayerAddInventory("SpreaderBar", 1);	// Q
	if ((KeyPress == 82) || (KeyPress == 114)) PlayerAddInventory("Rope", 1);
	if ((KeyPress == 83) || (KeyPress == 115)) PlayerAddInventory("SleepingPill", 1);
	if ((KeyPress == 84) || (KeyPress == 116)) PlayerAddInventory("TapeGag", 1);
	if ((KeyPress == 86) || (KeyPress == 118)) PlayerAddInventory("VibratingEgg", 1);
	if ((KeyPress == 87) || (KeyPress == 119)) PlayerAddInventory("Blindfold", 1);		// W
	if ((KeyPress == 88) || (KeyPress == 120)) PlayerAddInventory("Straitjacket", 1);	// X
	if ((KeyPress == 89) || (KeyPress == 121)) PlayerAddInventory("ButtPlug", 1);		// Y
	if ((KeyPress == 90) || (KeyPress == 122)) PlayerAddInventory("Chain", 1);			// Z
}
