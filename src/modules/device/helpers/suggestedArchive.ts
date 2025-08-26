const SUGGESTED_POINTS: string[] = [
    'ac_c_mode',
    'ac_c_onoff',
    'ac_c_speed',

    'ac_s2_mode',
    'ac_s2_onoff',
    'ac_s2_speed',

    'ac_s3_mode',
    'ac_s3_onoff',
    'ac_s3_speed',

    'ac_s4_mode',
    'ac_s4_onoff',
    'ac_s4_speed',

    'ac_s5_mode',
    'ac_s5_onoff',
    'ac_s5_speed',
    
    'alarm',
    'b1',
    'b2',
    'b3',
    'b4',
    'b5',
    'consumption',

    'cur_heat',
    'cur_mode',
    'cur_onoff',
    'cur_vent',

    'cur2_heat',
    'cur2_mode',
    'cur2_onoff',
    'cur2_vent',

    'fc_c_mode',
    'fc_c_modetemp',
    'fc_c_onoff',
    'fc_c_tmain',
    'fc_c_y1',

    'fc_s2_mode',
    'fc_s2_modetemp',
    'fc_s2_onoff',
    'fc_s2_tmain',
    'fc_s2_vent',
    'fc_s2_y1',

    'fc_s3_mode',
    'fc_s3_modetemp',
    'fc_s3_onoff',
    'fc_s3_tmain',
    'fc_s3_vent',
    'fc_s3_y1',

    'fc_s4_mode',
    'fc_s4_modetemp',
    'fc_s4_onoff',
    'fc_s4_tmain',
    'fc_s4_vent',
    'fc_s4_y1',

    'fc_s5_mode',
    'fc_s5_modetemp',
    'fc_s5_onoff',
    'fc_s5_tmain',
    'fc_s5_vent',
    'fc_s5_y1',

    'm_2l',
    'm_3l',
    'm_com',
    'm_l1',
    'm_pow1',
    'm_pow2',
    'm_pow3',
    'm_pow_avg_act',
    'm_sum_react',
    'mode',
    'pwrexh',
    'pwrsup',
    'recstate',
    'tavr',
    'throt',
    'tmain',
    'tset',
    'tset_klim',
    'tsetactual',
    'tseto',
    'unitstate',
    'vent',
    'workmode',
    'yrec'
]

export const isSuggestedArchivePoint = (pointXid: string | undefined): boolean => {
    return Boolean(pointXid !== undefined && SUGGESTED_POINTS.includes(pointXid.toLowerCase()));
}