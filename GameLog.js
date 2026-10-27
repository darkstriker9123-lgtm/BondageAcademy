// ===== GAME LOG =====
// Records events by chapter / actor / event name + optional timer.
// Works with the new day chapters (C001_Day01 etc.) without changes.

var GameLog = [];
var GameLogChapter = 0;
var GameLogActor = 1;
var GameLogEvent = 2;
var GameLogTimer = 3;

function GameLogSpecificAdd(ChapterToLog, ActorToLog, EventToLog) {
	if (ActorToLog == "") ActorToLog = "Player";
	for (var L = 0; L < GameLog.length; L++)
		if ((ChapterToLog == GameLog[L][GameLogChapter]) && (ActorToLog == GameLog[L][GameLogActor]) && (EventToLog == GameLog[L][GameLogEvent]))
			return;
	GameLog[GameLog.length] = [ChapterToLog, ActorToLog, EventToLog, 0];
}

function GameLogSpecificAddTimer(ChapterToLog, ActorToLog, EventToLog, TimerToLog) {
	if (ActorToLog == "") ActorToLog = "Player";
	for (var L = 0; L < GameLog.length; L++)
		if ((ChapterToLog == GameLog[L][GameLogChapter]) && (ActorToLog == GameLog[L][GameLogActor]) && (EventToLog == GameLog[L][GameLogEvent])) {
			GameLog[L] = [ChapterToLog, ActorToLog, EventToLog, TimerToLog];
			return;
		}
	GameLog[GameLog.length] = [ChapterToLog, ActorToLog, EventToLog, TimerToLog];
}

function GameLogSpecificDelete(ChapterToDelete, ActorToDelete, EventToDelete) {
	for (var L = 0; L < GameLog.length; L++)
		if ((ChapterToDelete == GameLog[L][GameLogChapter]) && (ActorToDelete == GameLog[L][GameLogActor]) && (EventToDelete == GameLog[L][GameLogEvent]))
			GameLog.splice(L, 1);
}

function GameLogAdd(EventToLog) {
	GameLogSpecificAdd(CurrentChapter, CurrentActor, EventToLog);
}

function GameLogAddTimer(EventToLog, TimerToLog) {
	if (TimerToLog >= 0)
		GameLogSpecificAddTimer(CurrentChapter, CurrentActor, EventToLog, TimerToLog);
	else
		GameLogSpecificDelete(CurrentChapter, CurrentActor, EventToLog);
}

function GameLogQuery(ChapterToQuery, ActorToQuery, EventToQuery) {
	for (var L = 0; L < GameLog.length; L++)
		if ((ChapterToQuery == "") || (ChapterToQuery == GameLog[L][GameLogChapter]))
			if ((ActorToQuery == "") || (ActorToQuery == GameLog[L][GameLogActor]))
				if ((EventToQuery == "") || (EventToQuery == GameLog[L][GameLogEvent]))
					if ((GameLog[L][GameLogTimer] == 0) || (CurrentTime < GameLog[L][GameLogTimer]))
						return true;
	return false;
}
