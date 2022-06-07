import { ExpertSystem } from './expert-system';
declare let outputs: any; //Map<string, any>;
declare let knowledge: any; // Map<string, any>;
declare function log(category: string, message: string): void;
declare function addKnowledge(tag: string, data: any):void;



export function generalESRun(inputData:any){
    let data = {
        UNSAFE_MANUFACTURER : inputData[0],
        EMAIL_MATCH_WEBSITE : inputData[1],
        TOO_MANY_HIGH_RISK_APPS : inputData[2],
        TOO_MANY_MED_RISK_APPS : inputData[3],
        APP_COUNT: inputData[4],
        ANDROID_OS_VERSION : inputData[5],
        APP_AVG_SCORE : inputData[6],
    }
    const generalES = new ExpertSystem();
    addKnowledgeapp(data,generalES);
    addRules(generalES);
    generalES.Start();
    return (Math.round(((generalES.knowledge.get('DEVICE_SCORE')) + Number.EPSILON) * 100) / 100.0)

}

function addKnowledgeapp(inputData:any ,es:ExpertSystem){
    for(const [key,value] of Object.entries(inputData)){
        es.addKnowledge(key,value);
    }
}


function addRules(es: any) {
    es.addRule('lots of apps', () => {
      if (knowledge.get('APP_COUNT') > 40 && knowledge.get('APP_COUNT') <= 60) {
        addKnowledge('LOTS_OF_APPS', true);
        log('device', 'More Apps than the average User: ' + knowledge.get('APP_COUNT'));
      }
    });
    es.addRule('too many apps', () => {
      if (knowledge.get('APP_COUNT') > 60 && knowledge.get('APP_COUNT') <= 100) {
        addKnowledge('TOO_MANY_APPS', true);
        log('device', 'Large number of apps on device: ' + knowledge.get('APP_COUNT'));
      }
    });
    es.addRule('too many apps', () => {
      if (knowledge.get('APP_COUNT') > 100) {
        addKnowledge('WAY_TOO_MANY_APPS', true);
        log('device', 'Extremly large number of apps on device: ' + knowledge.get('APP_COUNT'));
      }
    });

    es.addRule('too many high risk apps', () => {
      if (knowledge.get('HIGH_RISK_COUNT') > 7) {
        addKnowledge('TOO_MANY_HIGH_RISK_APPS', true);
        log('device', 'Too many high risk apps');
      }
    });

    es.addRule('too many med risk apps', () => {
      if (knowledge.get('MED_RISK_COUNT') > 30) {
        addKnowledge('TOO_MANY_MED_RISK_APPS', true);
        log('device', 'too many medium risk apps');
      }
    });

    es.addRule('chineese manufacturers', () => {
      if (['Huawei', 'Xiaomi'].includes(knowledge.get('BRAND') ?? '')) {
        addKnowledge('UNSAFE_MANUFACTURER', true);
        log('device', 'unsafe manufacurer: ' + knowledge.get('BRAND'));
      }
    });

    es.addRule('version under 12', () => {
      if (knowledge.get('ANDROID_OS_VERSION')) {
        addKnowledge('VERSION_RISK', Math.max(0, 13 - knowledge.get('ANDROID_OS_VERSION')) / 4);
      }
    });
    es.addRule('compute app score subtraction', () => {
      if (knowledge.get('APP_AVG_SCORE')) {
        const app_risk = (10 - Math.floor(knowledge.get('APP_AVG_SCORE'))) / 4;
        addKnowledge('APP_RISK', app_risk);
      }
    });

    es.addRule('compute device security', () => {
      let dev_sec = 10.0;
      dev_sec -= knowledge.get('VERSION_RISK') ? 1.0 : 0;
      dev_sec -= knowledge.get('UNSAFE_MANUFACTURER') ? 1.0 : 0;
      dev_sec -= (knowledge.get('TOO_MANY_MED_RISK_APPS') ? 0.5 : 0);
      dev_sec -= (knowledge.get('TOO_MANY_HIGH_RISK_APPS') ? 0.5 : 0);
      dev_sec -= knowledge.get('WAY_TOO_MANY_APPS') ? 1.0 : 0;
      dev_sec -= knowledge.get('TOO_MANY_APPS') ? 0.5 : 0;
      dev_sec -= knowledge.get('LOTS_OF_APPS') ? 0.3 : 0;
      dev_sec -= (10 - Math.floor(knowledge.get('APP_AVG_SCORE') ?? 5)) / 4;

      addKnowledge('DEVICE_SCORE', dev_sec);
    });
}
