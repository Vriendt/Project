const CPM = require('./artistoo/build/artistoo-cjs.js')

const STEPS = 10000

let config = {
  ndim: 2,
  field_size: [300, 15],
  conf: {
    torus: [true, false],
    seed: 1,
    T: 20,
    J: [[NaN, 20], [20, 5]],
    LAMBDA_V: [0, 30],
    V: [0, 500],
    LAMBDA_P: [0, 2],
    P: [0, 300],
    LAMBDA_ACT: [0, 500],
    MAX_ACT: [0, 40],
    ACT_MEAN: "geometric"
  },
  simsettings: {
    NRCELLS: [3],
    BURNIN: 100,
    RUNTIME: 1000,
    RUNTIME_BROWSER: "Inf",
    STATSOUT: { browser: false, node: true },
    LOGRATE: 10,
    SAVEIMG: false  // disable image saving in tests
  }
}

let custommethods = {
  initializeGrid,
  buildChannel,
  drawBelow
}

function drawBelow() {
  this.Cim.drawPixelSet(this.channelvoxels, "AAAAAA")
}

function initializeGrid() {
  if (!this.helpClasses["gm"]) { this.addGridManipulator() }
  let nrcells = this.conf["NRCELLS"], cellkind, i
  this.buildChannel()
  for (cellkind = 0; cellkind < nrcells.length; cellkind++) {
    for (i = 0; i < nrcells[cellkind]; i++) {
      if (i == 0) {
        this.gm.seedCellAt(cellkind + 1, this.C.midpoint)
      } else {
        this.gm.seedCell(cellkind + 1)
      }
    }
  }
}

function buildChannel() {
  this.channelvoxels = this.gm.makePlane([], 1, 0)
  let gridheight = this.C.extents[1]
  this.channelvoxels = this.gm.makePlane(this.channelvoxels, 1, gridheight - 1)
  this.C.add(new CPM.BorderConstraint({
    BARRIER_VOXELS: this.channelvoxels
  }))
}

function runSim() {
  const sim = new CPM.Simulation(config, custommethods)
  for (let i = 0; i < STEPS; i++) {
    sim.step();
  }
  sim.toggleRunning()
}

test('Microchannel simulation runs without errors', () => {
  expect(() => runSim()).not.toThrow()
})