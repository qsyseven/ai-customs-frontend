export function getAiWelcomeMessage() {
  return '请直接输入需要咨询的商品描述，可包含商品名称、商品描述、主要用途、材质/成分、结构/组成、工作原理、加工/报验状态、是否零件/附件、拟申报税号等信息。'
}

export function getBasicFieldMock() {
  return {
    recognizedFields: [
      { label: '商品名称', value: '塑料水杯' },
      { label: '商品描述', value: '塑料水杯，PP材质，容量500ml，用于日常饮水' },
      { label: '主要用途', value: '日常饮水' },
      { label: '材质/成分', value: 'PP材质' }
    ],
    pendingFields: [
      {
        key: 'structure',
        label: '结构/组成',
        tip: '例如：杯身+内胆+杯盖、阀体+执行机构、主机+配件等',
        placeholder: '请输入结构/组成',
        demo: '杯身+杯盖'
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
        demo: '成品'
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
        code: '3924',
        name: '塑料制餐具、厨房用具及其他家庭用具',
        confidence: '较可能',
        reason: '商品为PP塑料水杯，用于日常饮水，通常需优先关注塑料制餐具及厨房用具方向。'
      },
      {
        code: '3926',
        name: '其他塑料制品',
        confidence: '备选',
        reason: '若实物不属于餐具、厨房用具或家庭用具列名范围，可作为备选方向。'
      },
      {
        code: '3923',
        name: '塑料制包装用品及类似品',
        confidence: '低',
        reason: '仅在实物主要作为包装、运输或容器用品使用时才需关注，本案例信息不作为优先方向。'
      }
    ],
    basisRefs: [
      '《中华人民共和国进出口税则》相关章注、品目条文。',
      '《进出口税则商品及品目注释》关于塑料制餐具、厨房用具及家庭用具的说明。',
      '《归类总规则》规则一：优先依据品目条文及类注、章注确定归类。'
    ],
    declarationSearchText: '已检索《中华人民共和国海关进出口商品规范申报目录》3924项下要求。该门类除基础字段外，还可能涉及成分含量、品牌、规格型号等特殊申报字段。系统已将特殊字段追加到下方字段列表。'
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
        key: 'materialRatio',
        label: '成分含量',
        tip: '例如：PP 100%、PP 90%+硅胶10%等',
        placeholder: '请输入成分含量',
        demo: 'PP 100%'
      },
      {
        key: 'model',
        label: '规格型号',
        tip: '例如：500ml、型号ABC-500等',
        placeholder: '请输入规格型号',
        demo: '500ml'
      }
    ]
  }
}

export function getFinalResultMock() {
  return {
    fieldSummary: [
      { label: '商品名称', value: '塑料水杯' },
      { label: '商品描述', value: '容量500ml，用于日常饮水' },
      { label: '主要用途', value: '日常饮水' },
      { label: '材质/成分', value: 'PP材质' },
      { label: '结构/组成', value: '杯身+杯盖' },
      { label: '工作原理', value: '不涉及' },
      { label: '加工/报验状态', value: '成品' },
      { label: '是否零件/附件', value: '否' },
      { label: '品牌', value: '无品牌' },
      { label: '成分含量', value: 'PP 100%' },
      { label: '规格型号', value: '500ml' }
    ],
    recommendedCode: '3924.10.xx',
    recommendedName: '塑料制餐具及厨房用具方向',
    classificationSummary: '建议优先按 3924.10.xx 塑料制餐具及厨房用具方向进一步复核；如实际用途不属于餐具/厨房用具，则转向 3924.90.xx 其他塑料制家庭用具方向对比。',
    featureSummary: [
      '商品为塑料水杯，材质为 PP。',
      '用途为日常饮水，容量500ml。',
      '从商品名称、材质和用途看，具有塑料制餐具或厨房用具特征。'
    ],
    reasoningProcess: [
      '首先按商品材质判断，该商品为PP塑料制品。',
      '其次按用途判断，该商品用于日常饮水，通常属于家庭或餐厨使用场景。',
      '如实物更偏一般家庭用具而非餐具/厨房用具，则需在3924项下其他子目中复核。'
    ],
    basisRefs: [
      '《中华人民共和国进出口税则》3924项下相关品目条文。',
      '《中华人民共和国海关进出口商品规范申报目录》3924项下申报要素要求。',
      '《归类总规则》规则一。'
    ],
    candidates: [
      {
        code: '3924.10.xx',
        name: '塑料制餐具及厨房用具方向',
        compare: '适用于塑料制餐具及厨房用具方向，和“日常饮水水杯”匹配度较高。'
      },
      {
        code: '3924.90.xx',
        name: '其他塑料制家庭用具方向',
        compare: '适用于其他塑料制家庭用具方向，作为实物用途不落入餐具/厨房用具时的备选。'
      },
      {
        code: '3926.90.xx',
        name: '其他塑料制品方向',
        compare: '若无法按3924列名归入时再进一步复核，当前不作为优先方向。'
      }
    ],
    riskTips: [
      '需确认商品是否属于餐具/厨房用具使用场景。',
      '如带过滤、保温、电子显示等特殊结构，可能影响具体子目判断。',
      '品牌、规格型号、材质和容量应与实物和单证保持一致。'
    ],
    missingSuggestions: [
      '建议补充商品图片、包装标签、产品说明书。',
      '建议确认是否配杯盖、吸管、过滤组件或其他附件。',
      '建议确认成分含量、品牌和规格型号。'
    ],
    declarationElements: [
      { label: '品名', value: '塑料水杯' },
      { label: '用途', value: '日常饮水' },
      { label: '材质', value: 'PP' },
      { label: '成分含量', value: 'PP 100%' },
      { label: '品牌', value: '无品牌' },
      { label: '规格型号', value: '500ml' }
    ]
  }
}
