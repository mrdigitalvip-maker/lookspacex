type EventName =
  | 'PLAYER_DIED'
  | 'MISSION_COMPLETE'
  | 'SHIP_DAMAGED'
  | 'WARP_START'
  | 'WARP_END'
  | 'ENEMY_SPOTTED'
  | 'ITEM_COLLECTED'
  | 'LEVEL_UP'
  | 'CREDITS_CHANGED'
  | 'SAVE_REQUESTED'

export class EventBus {
  private listeners = new Map<EventName, Array<(payload?: unknown) => void>>()

  publish(event: EventName, payload?: unknown) {
    this.listeners.get(event)?.forEach((listener) => listener(payload))
  }

  subscribe(event: EventName, listener: (payload?: unknown) => void) {
    const current = this.listeners.get(event) ?? []
    current.push(listener)
    this.listeners.set(event, current)
  }
}
