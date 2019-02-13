# to-pick-a-grain
This is an algorithme exercice in JS.

Soit un damier de taille n x n,
Il y a un nombre de grain aléatoire mais fixé avant le début du problème sur ce chaque case de ce damier,
Tu pars de la case en bas à gauche et tu te déplaces de case en case jusqu'à la case en haut à droite. Tu ne peux te déplacer que d'un coup vers le haut ou un coup à droite à chaque déplacement. Tu parcours donc 2n - 1 cases.
Tu accumules le nombre de grain sur chaque case sur laquelle tu passes
Coder une fonction qui trouve le nombre maximal de grain que tu peux récupérer !

Par exemple, sur ce damier 3x3 :
2 | 5 | 1
4 | 6 | 3
8 | 2 | 5
Tu peux récupérer au max 24 grains !

