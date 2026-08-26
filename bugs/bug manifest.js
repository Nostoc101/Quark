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
  'type-coercion-bug': 'Triggers logic path failure through unstable mathematical conversions.',
  'dns-failure': 'Forces core domain-name protocol addressing failure lookups.',
  'fs-write-fail': 'Triggers local disk capacity write protection parameters.',
  'fs-read-fail': 'Attempts system lookups across unindexed hardware directories.',
  'port-conflict': 'Attempts redundant address initialization across bounded dynamic resources.',
  'ssl-expired': 'Simulates secure transport certificate date boundaries failures.',
  'cors-blocked': 'Simulates cross-origin gateway header origin parsing rejections.',
  'eval-error': 'Runs unsafe string evaluations inside isolated context structures.',
  'range-error': 'Passes variable sets beyond platform numeric restrictions.',
  'uri-error': 'Passes bad characters to standard address decoding components.',
  'event-emitter-leak': 'Registers endless asynchronous event hooks without clearing them.',
  'gc-freeze': 'Forces persistent data tracking structures to block clean routines.',
  'buffer-alloc-error': 'Attempts safe allocation of oversized uninitialized data structures.',
  'crypto-fail': 'Simulates message verification parameter mismatch routines.',
  'zlib-error': 'Passes raw uncompressed data streams to decompression filters.',
  'child-process-fail': 'Attempts child core forks with invalid environment access parameters.',
  'http2-error': 'Simulates high-velocity frame breakdown events.',
  'process-disconnect': 'Triggers internal process connection detachment simulations.',
  'worker-terminate': 'Terminates dynamic execution paths abruptly during operation sequences.',
  'intl-error': 'Passes un-parsable formatting localization variables into translation engines.',
  'async-hooks-leak': 'Instantiates complex task tracing loops without closing contextual hooks.',
  'v8-heap-exhaust': 'Exhausts low-level memory allocations inside system engine stacks.',
  'readline-freeze': 'Locks interface text streams into perpetual polling states.',
  'repl-crash': 'Forces evaluation engine failures within specialized code contexts.',
  'stream-destroy': 'Closes processing streams before downstream operations complete.',
  'cluster-disconnect': 'Forces active cluster workers out of configuration synchronization trees.',
  'net-server-fail': 'Simulates transport-level listener failures during operational initialization.',
  'dgram-error': 'Throws transmission errors within low-overhead connectionless data channels.',
  'module-not-found': 'Simulates a lookup failure for a non-existent runtime dependency.',
  'array-bound-panic': 'Attempts operations on empty memory indices.',
  'async-deadlock': 'Creates two interdependent promises that wait for each other infinitely.',
  'timer-overflow': 'Schedules event timers with values exceeding safe bounds.',
  'prototype-pollution': 'Simulates security warnings for base constructor object overrides.',
  'math-precision-error': 'Triggers float processing calculations that yield control values.',
  'aborted-fetch': 'Cancels internal platform data fetches midway through processing.'
};

// Automate identical performance validation payloads up to index 55 safely
for (let i = 45; i <= 55; i++) {
  BUG_MANIFEST[`diagnostic-fault-${i}`] = `Automated high-velocity diagnostic exception sequence matrix node ${i}.`;
}

module.exports = { BUG_MANIFEST };
