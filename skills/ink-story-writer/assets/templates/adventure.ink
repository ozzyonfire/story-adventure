// Ink starter template

VAR trust = 0

-> start

=== start ===
A high-pressure opening pushes the protagonist into a choice.
+ [Take the risky option.] -> risky
+ [Take the careful option.] -> careful
+ [Ask an ally for help.] -> ally

=== risky ===
~ trust = trust - 1
You move fast and accept immediate danger.
-> crossroads

=== careful ===
You secure an advantage before advancing.
-> crossroads

=== ally ===
~ trust = trust + 1
You reveal intent and rely on someone else.
-> crossroads

=== crossroads ===
Continue branch logic here with canon-aligned outcomes.
-> END
