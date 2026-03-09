# BleatchVR

Angaben zu der überwiegender Nutzung von künstlicher Intelligenz sind am Enfang eines entsprechenden Files zu finden. In jedem anderen Fall ist KI für über 50 % des Codes verantwortlich. Wir sehen KI als Tool um schnell lange Dokumentationen durchsuchen zu können und zu komplexen Code (zum Beispiel wegen zu weiterführender Mathematik) dennoch im Projekt angeben zu können, statt auf externen Code angewiesen zu sein. Jeder von uns ist selbst für die Menge der genutzten Hilfe verantwortlich.

Potenzielles Problem mit Lootboxen von anderen Spielern. Lootbox id Zusammensetzung: `"lootbox" + <num> + <username>`

Hitkonzept:

    Player1 hittet Lootbox von Player2:

        Player1 (Erkennt Collision von lokal Weapon mit networked Lootbox):

            Wenn Player1 noch genug Energy,
            dann Lootbox wird zerstört und Player1 bekommt Item,
            sonst return

            Spielt Sound

        Player2 (Erkennt Collision von networked Weapon mit lokal Lootbox):

            Wenn Player1 noch genug Energy,
            dann Lootbox wird zerstört und synchronisiert mit allen anderen,
            sonst return

    Player2 wird Lead - Spawner statt Player1:

        Player1 (Erkennt, dass er nicht mehr Lead ist):

            Spawnt keine neuen Lootboxen mehr

            Bleibt bei seiner aktuellen Konfiguration

        Player2 (Erkennt, dass er jetzt Lead ist):

            Bleibt bei der aktuellen Konfiguration

            Übernimmt eventuelle Spawnings in der Zunkunft

    Player1 hittet Player2:

        Player1 (Erkennt Collision von lokal Weapon mit networked Player):

            Wenn Player1 noch genug Energy,
            dann Energy = Energy - Abzug,
            sonst return

            Spielt Sound

            Wenn Player2 jetzt tot,
            dann verarbeite das

        Player2 (Erkennt Collision von networked Weapon mit lokal Player):

            Wenn Player1 noch genug Energy,
            dann Health = Health - Abzug,
            sonst return

            Spielt Sound

    ==> Nur Sync von Basic-Spielerdaten, aber keine Events. Latenz (evt auch künstlich im Code) sorgt dafür, dass alle beteiligten noch den Zustand vor dem Hit haben sollten.


Was brauchen wir am Ende:

    - Networked Lootboxen, Spieler (inkl. Waffen usw.)
    - Networked Stats (Health, Energy, onCooldown)
    - Welt
    - Physics = Movement    !! Testen, evt Movement durch die Brillen selbst
    - hit-system auf allen Seiten, so wie oben erklärt
    - hud für alle Spieler lokal auf Basis von Networked Stats
    - Sounds lokal auf Basis von hit-system