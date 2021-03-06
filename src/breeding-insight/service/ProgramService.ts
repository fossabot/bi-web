/*
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ProgramDAO} from "@/breeding-insight/dao/ProgramDAO";
import {Program} from "@/breeding-insight/model/Program";

export class ProgramService {

  static create(program: Program): Promise<Program> {
    //TODO: Check everything is good
    return new Promise<Program>((resolve, reject) => {

      if (program.id === undefined) {
        ProgramDAO.create(program).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram = new Program(result.id, result.name);
          resolve(newProgram);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static update(program: Program): Promise<Program> {
    //TODO: Check everything is good
    return new Promise<Program>((resolve, reject) => {

      if (program.id) {
        ProgramDAO.update(program.id, program).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram = new Program(result.id, result.name, result.species.id);
          resolve(newProgram);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static archive(id: string): Promise<Program> {
    //TODO: Check everything is good
    return new Promise<any>(((resolve, reject) => {

      if (id){
        return ProgramDAO.archive(id)
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        reject();
      }

    }));
  }

  static getAll(): Promise<Program[]> {
    return new Promise<Program[]>(((resolve, reject) => {

      ProgramDAO.getAll().then((biResponse) => {

        let programs: Program[] = [];
    
        // TODO: workaround for no programs for now
        if (biResponse.result.data) {
          // Parse our programs into the vue programs param
          programs = biResponse.result.data.map((program: any) => {
            return new Program(program.id, program.name, program.species.id);
          });
        }
    
        resolve(programs);
    
      }).catch((error) => reject(error));
    
    }));
  }

  static getOne(programId: string): Promise<Program> {
    return new Promise<Program>(((resolve, reject) => {

      if (programId === null) {
        reject();
      }

      ProgramDAO.getOne(programId).then((biResponse) => {
        const result = biResponse.result;
        const program = new Program(result.id, result.name, result.species.id);
        resolve(program);
      }).catch((error) => reject(error));

    }));
  }

}

