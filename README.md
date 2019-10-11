Flying bird [not trademarked]

## Functionality

Best score -> localStorage
Leaderboard -> localStorage

Generate random map
- fixed vertical gap space
- min and max vertical gap position
- min and max horizontal gap space
- fixed column width
- floor position

Not using a game engine:
- so need to keep track of acceleration
- can draw everything as rectangle, later maybe replace with sprites
- can collide as rectangles, later maybe collision mask

Maybe native canvas, maybe Fabric.js?

Share to twitter
```
    https://twitter.com/intent/tweet
        ?url= encodeURIComponent(location.origin)
        &text= encodeURIComponent(`I scored ${score} points on a bird`)
```

## State

Flying, dead
Initial: position, generate map


## Missing

- Leaderboard -> localStorage
- Advanced collision mask
- Some sprites
- Make background around bird sprites transparent
- Replace sprites with production ready ones
