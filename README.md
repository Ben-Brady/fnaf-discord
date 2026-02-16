- Foxy It's me sign when he's left, 1/100

## Bonnie Chica Twitching

On night 4 and onwards, bonnie and chica will animate on door cams:

```py
# Every 0.05s
pose = random(1, 30)
if 25 <= pose <= 28:
    # tilt head
if pose >= 29:
    # open mouth
```

there is a robot sfx associated with this

```py
# Every 0.1s
volume = random()
```

## Pirate Song

```py
# every 4s
if foxy_stage == 0: # curtains closed
    and random(1, 30) == 1:
    # play pirate song
```

## Circus Music

```py
# every 5s
if random(1, 30) == 1:
    # play circus song
```

## Door Pounding

```py
# every 10s
if random(1, 50) == 1:
    volume = random()
    # play door sound
```

## Chica Kitchen

```py
# every 4s
sound = random(1, 10)
if sound == 1: # play kitchen 1
elif sound == 2: # play kitchen 2
elif sound == 3: # play kitchen 3
elif sound == 4: # play kitchen 4
elif sound == 5: # play kitchen 5
else: # continue current sound
```

## Hallucinations

```py
# every 1s
if activated:
    # wait 1.66s
    # disabled
elif random(1, 1000) == 1:
    # activate
```

```py
while active:
    if random(1, 10) == 1:
        visible = True
    else:
        visible = False
```

## Camera Easter Eggs

- k

## AI

```py
if night == 0:
    if am == 2:
        bonnie += 1
    if am == 3:
        bonnie += 1
        chica += 1
        foxy += 1
    if am == 4:
        bonnie += 1
        chica += 1
        foxy += 1
```

## Powerout Freddy Flicker

```py
# every 0.05s
if random(1, 4) = 1:
    visible = True
else:
    visible = False
```

## Main Menu

```py
# every 0.3s
freddy_opacity = random()
```

```py
# every 0.8s
pose = random(0, 99)
if pose = 97:
    # open mouth
elif pose = 98:
    # side eye
elif pose = 99:
    # endo head
else:
    # normalpost

freddy_opacity = random()
```
