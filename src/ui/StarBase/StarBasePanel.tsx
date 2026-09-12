import { SHIP_CATALOG, useShipStore } from '@/stores/shipStore'
import { useStarBaseStore } from '@/stores/starbaseStore'
import { useUIStore } from '@/stores/uiStore'

export function StarBasePanel() {
  const dockingState = useStarBaseStore((state) => state.dockingState)
  const servicesOpen = useStarBaseStore((state) => state.servicesOpen)
  const toggleServices = useStarBaseStore((state) => state.toggleServices)
  const currentShip = useShipStore((state) => state.currentShip)
  const fuel = useShipStore((state) => state.fuel)
  const shield = useShipStore((state) => state.shield)
  const energy = useShipStore((state) => state.energy)
  const refuel = useShipStore((state) => state.refuel)
  const repairShield = useShipStore((state) => state.repairShield)
  const rechargeEnergy = useShipStore((state) => state.rechargeEnergy)
  const serviceAll = useShipStore((state) => state.serviceAll)
  const setCurrentShip = useShipStore((state) => state.setCurrentShip)
  const addNotification = useUIStore((state) => state.addNotification)

  if (dockingState === 'away') return null

  if (dockingState === 'approach') {
    return (
      <div className="starbase-approach">
        <span>HELIOS OUTPOST // DOCKING CORRIDOR</span>
        <strong>PRESS G TO REQUEST AUTODOCK</strong>
      </div>
    )
  }

  if (dockingState === 'docking') {
    return (
      <div className="starbase-approach docking-live">
        <span>HELIOS CONTROL</span>
        <strong>AUTODOCK IN PROGRESS</strong>
      </div>
    )
  }

  if (!servicesOpen) {
    return (
      <button className="starbase-docked-chip" type="button" onClick={toggleServices}>
        <span>DOCKED // HELIOS OUTPOST</span>
        <strong>H · OPEN STARBASE SERVICES</strong>
      </button>
    )
  }

  const service = (label: string, action: () => void, message: string) => (
    <button
      type="button"
      onClick={() => {
        action()
        addNotification(message, 'success')
      }}
    >
      {label}
    </button>
  )

  return (
    <section className="starbase-services" aria-label="Helios StarBase services">
      <div className="starbase-services-head">
        <div>
          <span>HELIOS OUTPOST // HANGAR 07</span>
          <h2>StarBase Services</h2>
        </div>
        <button type="button" className="starbase-close" onClick={toggleServices}>×</button>
      </div>

      <div className="starbase-systems">
        <div><span>FUEL</span><strong>{fuel.toFixed(0)}%</strong></div>
        <div><span>SHIELD</span><strong>{shield.toFixed(0)}%</strong></div>
        <div><span>ENERGY</span><strong>{energy.toFixed(0)}%</strong></div>
      </div>

      <div className="starbase-service-actions">
        {service('Refuel', refuel, 'HELIOS SERVICE // Fuel tanks full')}
        {service('Repair Shield', repairShield, 'HELIOS SERVICE // Shield restored')}
        {service('Recharge', rechargeEnergy, 'HELIOS SERVICE // Energy cells charged')}
        {service('Full Service', serviceAll, 'HELIOS SERVICE // Aurora systems nominal')}
      </div>

      <div className="starbase-fleet-title">
        <span>HANGAR FLEET</span>
        <strong>{currentShip?.name ?? 'No frame selected'}</strong>
      </div>

      <div className="starbase-fleet-grid">
        {SHIP_CATALOG.map((ship) => {
          const active = currentShip?.id === ship.id
          const selectable = ship.unlocked && ship.owned
          return (
            <button
              type="button"
              key={ship.id}
              className={`starbase-ship-card ${active ? 'active' : ''} ${!selectable ? 'locked' : ''}`}
              disabled={!selectable}
              onClick={() => {
                setCurrentShip(ship)
                addNotification(`HANGAR // ${ship.name} selected`, 'success')
              }}
            >
              <i style={{ background: ship.placeholder_color }} />
              <span>{ship.class.toUpperCase()}</span>
              <strong>{ship.name}</strong>
              <small>{selectable ? (active ? 'ACTIVE FRAME' : 'SELECT FRAME') : `LOCKED · LEVEL ${ship.level}`}</small>
            </button>
          )
        })}
      </div>
    </section>
  )
}
