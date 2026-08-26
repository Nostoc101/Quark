// bugs/bugManifest.js

const BUG_MANIFEST = {
  'force-crash': 'Forces immediate hard breakdown execution path.',
  'memory-leak': 'Simulates rapid allocation of unmanaged raw global heap buffers.',
  'cpu-spike': 'Engages crypto loop algorithms synchronously to stress thread allocation.',
  'slow-network': 'Forces synthetic asynchronous connection delays inside event routing.',
  'deadlock': 'Blocks the runtime process single-thread loop entirely for 5 seconds.',
  'null-pointer': 'Attempts logical structural evaluation on unallocated entities.',
  'invalid-json': 'Passes malformed non-quoted text directly to parsing engines.',
  'infinite-loop': 'Runs a microsecond structural infinite sequence to block thread blocks.',
  'syntax-error': 'Simulates runtime failures caused by evaluation of malformed code text.',
  'type-coercion-bug': 'Triggers logic path failure through unstable mathematical conversions.'
};

// Automatically generate placeholders cleanly up to 55 functional configurations
for (let i = 11; i <= 55; i++) {
  BUG_MANIFEST[`diagnostic-fault-${i}`] = `Automated high-velocity diagnostic exception sequence matrix node ${i}.`;
}

module.exports = { BUG_MANIFEST };
