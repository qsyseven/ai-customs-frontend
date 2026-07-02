export function getAiWelcomeMessage() {
  return '请直接输入需要咨询的商品描述，可包含商品名称、商品描述、主要用途、材质/成分、结构/组成、工作原理、加工/报验状态、是否零件/附件、拟申报税号等信息。'
}

export function getBasicFieldMock() {
  return {
    recognizedFields: [
      { label: '商品名称', value: '不锈钢保温杯' },
      { label: '商品描述', value: '不锈钢保温杯，容量500ml，带塑料杯盖' },
      { label: '主要用途', value: '用于盛装饮品' },
      { label: '材质/成分', value: '不锈钢、塑料杯盖' }
    ],
    pendingFields: [
      {
        key: 'structure',
        label: '结构/组成',
        tip: '例如：杯身+内胆+杯盖、阀体+执行机构、主机+配件等',
        placeholder: '请输入结构/组成',
        demo: '杯身+内胆+塑料杯盖'
      },
      {
        key: 'principle',
        label: '工作原理',
        tip: '如无机械、电气、化学等工作原理，可填写“不涉及”',
        placeholder: '请输入工作原理',
        demo: '不涉及'
      },
      {
        key: 'status',
        label: '加工/报验状态',
        tip: '例如：成品、散装、零售包装、未组装等',
        placeholder: '请输入加工/报验状态',
        demo: '成品，零售包装'
      },
      {
        key: 'isPart',
        label: '是否零件/附件',
        tip: '例如：否、是某设备零件、是某设备附件',
        placeholder: '请输入是否零件/附件',
        demo: '否'
      },
      {
        key: 'proposedHs',
        label: '拟申报税号',
        tip: '如用户已有拟申报税号，可填写；没有可留空',
        placeholder: '请输入拟申报税号',
        demo: ''
      }
    ]
  }
}

export function getHs4Mock() {
  return {
    candidates: [
      {
        code: '9617',
        name: '保温瓶和其他真空容器及其零件',
        confidence: '较可能',
        reason: '商品具有保温杯特征，通常需优先关注真空容器相关品目。'
      },
      {
        code: '7323',
        name: '钢铁制餐桌、厨房或其他家用器具',
        confidence: '备选',
        reason: '若实物并非真空保温结构，而仅为普通不锈钢饮具，可作为备选方向。'
      },
      {
        code: '3924',
        name: '塑料制餐具、厨房用具及其他家庭用具',
        confidence: '低',
        reason: '商品仅杯盖为塑料，主体材质不是塑料，通常不作为优先方向。'
      }
    ],
    basisRefs: [
      '《中华人民共和国进出口税则》相关章注、品目条文。',
      '《进出口税则商品及品目注释》关于真空容器及金属家用器具的说明。',
      '《归类总规则》规则一：优先依据品目条文及类注、章注确定归类。'
    ],
    declarationSearchText: '已根据 9617 方向检索规范申报目录，可能需要继续确认品牌、型号、材质、保温方式、容量等申报字段。'
  }
}

export function getSpecialFieldMock() {
  return {
    pendingFields: [
      {
        key: 'brand',
        label: '品牌',
        tip: '如无品牌可填写“无品牌”',
        placeholder: '请输入品牌',
        demo: '无品牌'
      },
      {
        key: 'model',
        label: '规格型号',
        tip: '例如：500ml、型号ABC-500等',
        placeholder: '请输入规格型号',
        demo: '500ml'
      },
      {
        key: 'insulation',
        label: '保温方式',
        tip: '例如：真空保温、普通双层结构、不保温',
        placeholder: '请输入保温方式',
        demo: '真空保温'
      },
      {
        key: 'materialRatio',
        label: '材质/成分说明',
        tip: '例如：不锈钢杯身，塑料杯盖',
        placeholder: '请输入材质/成分说明',
        demo: '不锈钢杯身，塑料杯盖'
      }
    ]
  }
}

export function getFinalResultMock() {
  return {
    fieldSummary: [
      { label: '商品名称', value: '不锈钢保温杯' },
      { label: '商品描述', value: '容量500ml，用于盛装饮品，带塑料杯盖' },
      { label: '主要用途', value: '盛装饮品' },
      { label: '材质/成分', value: '不锈钢杯身，塑料杯盖' },
      { label: '结构/组成', value: '杯身+内胆+塑料杯盖' },
      { label: '工作原理', value: '不涉及' },
      { label: '加工/报验状态', value: '成品，零售包装' },
      { label: '是否零件/附件', value: '否' },
      { label: '品牌', value: '无品牌' },
      { label: '规格型号', value: '500ml' },
      { label: '保温方式', value: '真空保温' }
    ],
    recommendedCode: '9617.00.xx',
    recommendedName: '保温瓶及其他真空容器方向',
    classificationSummary: '建议优先按 9617.00.xx 保温瓶及其他真空容器方向进一步复核。',
    featureSummary: [
      '商品为不锈钢保温杯，容量500ml。',
      '用途为盛装饮品，结构含杯身、内胆和塑料杯盖。',
      '若实物确认为真空保温结构，应优先关注真空容器方向。'
    ],
    reasoningProcess: [
      '首先按商品功能判断，该商品用于盛装饮品并具备保温用途。',
      '其次按结构判断，若为真空保温杯，通常优先关注保温瓶和真空容器相关品目。',
      '若经实物确认并非真空保温结构，则需回到钢铁制家用器具方向进行复核。'
    ],
    basisRefs: [
      '《中华人民共和国进出口税则》相关品目条文。',
      '《进出口税则商品及品目注释》关于保温瓶、真空容器及金属家用器具的说明。',
      '《归类总规则》规则一。'
    ],
    candidates: [
      {
        code: '9617.00.xx',
        name: '保温瓶及其他真空容器方向',
        compare: '适用于具备真空保温结构的保温杯，当前匹配度较高。'
      },
      {
        code: '7323.xx.xx',
        name: '钢铁制餐桌、厨房或其他家用器具方向',
        compare: '若商品只是普通不锈钢杯，不具备真空保温结构，可作为备选方向。'
      },
      {
        code: '3924.xx.xx',
        name: '塑料制家庭用具方向',
        compare: '仅杯盖为塑料时一般不优先按塑料制品归类，除非主体材质或功能另有变化。'
      }
    ],
    riskTips: [
      '需确认是否确为真空保温结构，普通双层杯和真空保温杯可能影响归类方向。',
      '如带电子显示、温控、过滤等特殊结构，可能影响具体子目判断。',
      '品牌、型号、容量、材质应与实物和单证保持一致。'
    ],
    missingSuggestions: [
      '建议补充商品图片、包装标签、产品说明书。',
      '建议确认内胆结构和是否抽真空。',
      '建议确认是否带电子元件、滤芯或其他附加功能。'
    ],
    declarationElements: [
      { label: '品名', value: '不锈钢保温杯' },
      { label: '用途', value: '盛装饮品' },
      { label: '材质', value: '不锈钢杯身，塑料杯盖' },
      { label: '品牌', value: '无品牌' },
      { label: '规格型号', value: '500ml' },
      { label: '保温方式', value: '真空保温' }
    ]
  }
}

