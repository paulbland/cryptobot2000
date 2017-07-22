NEW METHOD OF TESTING


set one value to a single known good one (in thids case low/high both = 15)
then run huuuuuge array on ithers (eg 50 values)


RESULTS
---
low 15-16   ---> (tried 1-45, high was 15, sum was 21.5)
high 14     ---> (tried 1-45, low was 15, sum was 21.5)
sum 18      ---> (tried 1-48, (low and high were both 15)
combo 
	13.25-period
	4.75-offset 
	---> (tests 0.125 increments, buffer=1, low and high were 15, sum was 18)
    (--> oops can onyl do 0.5 inc! in real sim)

SO BESTS ARE:

period-13.25
offset-4.75
low-0.155
high-0.14
    -->together these are not grea values! (only 44%)
    --> i think maybe 13/4 is not great..

    **maybe the spikes on the combo cahrt.. are acutall not great. rememerb these are just adding up tables. thats the whole table. maybe... hmm i dont know**


FILES:
-------

TEST A
    low 1---->45
    high 15
    sum 21.5

TEST B
    low 15
    high 1---->45
    sum 21.5

TEST C
    low 15
    high 15
    sum 1---->48

TEST D
    low 15
    high 15
    sum 18
    combo: inc = 0.125, buffer = 1

TEST D-2
    low 15
    high 15
    sum 18, 19, 20
    combo: inc = 0.125, buffer = 1

TEST D-3
    low 15
    high 15
    sum 20
    combo: inc = 0.125, buffer = 1


FULL OVERNIGHT TEST:
    low 10-20
    high 10-20
    sum 14-22 (in 0.5 increments)
    inc = 1
    buffer = 4
    est. time = 1:10:07



* some questiosn about why sums are high in some tests and lower in others (eg 18 vs 20 in these tests.) need to figure that out!