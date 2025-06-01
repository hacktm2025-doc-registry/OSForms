Criterii luate de la mentori:

1. Validare problema
2. Pragmatism solutie,
   Nivel inovare
3. Tech stack, arhitectura, principii tech, claritate cod
4. Pitch - claritatea prezentarii

1. Am discutat cu departament IT de la consiliul judetean pentru clarificarea problemei:
    - pe scurt: eliminarea mutatului de hartii
    comerciala, sutele de primarii mici n-au
    - ce se vrea:
        - o solutie usor adaptabila, fara overhead tehnic, disponibila ideal pe gratis pentru primarii mici
        - procese usor de adaptat, modelabile in detaliu fara interventii majore in aplicatie
        - gestionare complexa a drepturilor de acces, a rutarii documentelor, structurii organizationale
    - context:
        - primariile vor beneficia de hosting din partea consiliului local
        - consiliul local va opera un fel de cloud privat pe infrastructura proprie, on prem
        => solutia trebuie sa poata deservi mai multe organizatii folosind aceeasi infrastructura
        - totusi, din motive de protectie a datelor diferitele instante trebuiesc separate strict din punct de vedere al datelor
        
        
2. Strategia de abordare: combinarea creativa a cat mai multe componente
- chiar avem omponentele esentiale - toate open source, Apache License:
    - editor de formulare - [form.io](https://form.io)
    - BPMN - business process model and notation
        - editor grafic de procese: [bpmn.io](https://bpmn.io)
        - engine de executie: [bpmn-engine](https://github.com/paed01/bpmn-engine)
- editorul de formulare ne permite sa replicam cu usurinta formularele de pe hartie sau formulare deja existente online
- editorul grafic ne permite sa modelam rapid si in mod expresiv procesele primariilor - care nu sunt deloc simple
- engine-ul de executie ne permite sa executam procesul asa cum a fost modelat in editorul grafic, cu integrarea formularelor asa cum au fost construite in editorul de formulare

- nu-i totul roz:
    - editorul grafic necesita extensii pe care va trebui sa le implementam, pentru a permite modelarea la nivelul de detaliu necesar pentru executie
    - proiectul e mare, si stack-ul de tehnologii s-ar putea schimba - ce am ales acuma aa fost ceea ce ne-a permis prototyping-ul cel mai rapid
    - chiar daca ambele editoare (BPMN si formulare) sunt intuitive, nivelul de detaliu cerut petru executie ulterioara face editoarea destul de costisitoare in termeni de efort, si cere intelegere a procesului, nu doar a instrumentelor
    => ceva efort si implicare din partea oamenilor ne-tehnici din primarii va fi necesar

- ce-i inovativ:
    - low code/no code pentru configurarea proceselor si definirea formularelor
    - care chiar si functioneaza
    - ne gandim sa construim editorul de BPMN peste PlantUML - ar permite modelarea extrem de comoda a proceselor

3. Tech stack
- ca mai sus
- Codul ...
   - avem un demo cap-coada
   - din care lipseste executia unui model BPMN - pe moment procesul e implementat manual
   - dar avem un proof of concept de executie a unui model BPMN - care insa e un script separat, ne-integrat cu aplicatia demo
   - putem demonstra rularea a mai multe instante separate pe aceeasi masina
- arhitectura:
    - inca in flux
    - idei fundamentale:
        - instante separate pentru organizatii diferite
        - UI bazat strict pe browser
            - configurarea aplicatiei
            - configurarea proceselor
            - configurarea utilizatorilor si a organigramei
                - delegata la Active Directory - e ceea ce e a specificat stakeholder de la client
                - dar implementarea decuplata printr-o fatada de serviciu care stie sa raspunda la query-uri de genul ce utilizator are un rol anume, cine e inlocuitorul unui utilizator, daca utilizatorul e disponibil la un moment dat sau nu etc.
        - integrare seamless a cetatenilor care interactioneaza online cu primariile

