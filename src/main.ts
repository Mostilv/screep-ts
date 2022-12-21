import { ErrorMapper } from "utils/ErrorMapper";

import * as building from "building";
import * as tower from "tower";

import { roleBuilder } from "role/builder";
import { roleHarvester } from "role/harvester";
import { roleUpgrader } from "role/upgrader";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  building.run(Game.spawns.Spawn1);

  const towers = Game.spawns.Spawn1.room.find<StructureTower>(FIND_STRUCTURES, {
    filter: { structureType: STRUCTURE_TOWER, my: true }
  });
  towers.forEach(tower.run);

  // 根据 screep 的角色分配不同的任务
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role === "builder") {
      roleBuilder.run(creep);
    }
  }

  // 删除 Memory 中已经死亡的 creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }
});
