export const DefaultConfig  = {
    "modelName": 'defaultModel',
    "title": 'Default model config',
    "parameters": {
        "average_life_of_an_industrial_business": {
            title: 'Average life time of an industrial business',
            label: 'Life time in years',
            help: 'Choose a value between 0 and 30 years. This is the expected value for the end of the simulation period 2041',
            defaultValue: 20,
            min: 0,
            max: 30,
            type: 'number'
        },
        "average_life_of_a_service_business": {
            title: 'Average life time of a service business',
            label: 'Life time in years',
            help: 'Choose a value between 0 and 30 years. This is the expected value for the end of the simulation period 2041',
            defaultValue: 15,
            min: 0,
            max: 30,
            type: 'number'
        },
        "university_students_objective": {
            title: 'University education',
            label: 'Percentage of students starting university as a fraction of students completing "school"',
            help: 'The sum of people starting university and people starting vocational training must be equal to or less than 100. The remainder is counted as "unskilled workers"',
            defaultValue: 25,
            min: 15,
            max: 60,
            type: 'number'
        },
        "vt_fraction_objective": {
            title: 'Vocational training',
            label: 'Percentage of students starting vocational training as a fraction of students completing "school"',
            help: 'The sum of people starting university and people starting vocational training must be equal to or less than 100. The remainder is counted as "unskilled workers"',
            defaultValue: 70,
            min: 40,
            max: 85,
            type: 'number'
        },
        "farm_to_fork_effect_on_services": {
            title: 'Impact of Farm to Fork',
            label: 'The effect of Farm to Fork on the number of people employed in the agricultural services sector',
            xRange: [2022, 2041],
            yRange: [0, 5],
            defaultValue: [],
            help: 'Farm to fork is an EU strategy to strengthen European agriculture. Vidzeme has estimated that Farm to Fork could lead to new jobs in the agro-services sector. The realization of these jobs will rely on the effectiveness of the implementation of Farm to Fork in Lativa.  Using a scale between 0 and 5 you can express the effect of Farm to Fork strategy over time. 0 means none of the jobs are realized, 5 means all the jobs are realized.',
            type: 'graph'
        },
        "cap_ecoschemes": {
            title: 'Implementation of CAP Eco-schemes',
            label: 'The degree to which the CAP Eco-shemes mechanism is implemented in Latvia',
            xRange: [2022, 2041],
            yRange: [0, 5],
            defaultValue: [],
            help: 'CAP Eco-schemes aims to boost sustainable agricultural practices. This parameter reflects the implementation of CAP Eco-schemes in Latvia. Using a scale between 0 and 5 you can simulate variation over time. 0 means that the CAP Eco-schemes are not implemented, 5 means that the CAP Eco-schemes are fully implemented.',
            type: 'graph'
        },
        "population_covered_objective": {
            title: 'Broadband coverage',
            label: 'Percentage of population with access to broadband internet connectivity by 2041',
            min: 65,
            max: 100,
            defaultValue: 89,
            help: 'Enter the envisioned broadband coverage in 2041 as a percentage of the total  population',
            type: 'number'
        },
        "community_climate": {
            title: 'Community climate',
            label: 'Propensity of the community to tackle change and undertake common projects',
            xRange: [2022, 2041],
            yRange: [0, 5],
            defaultValue: [],
            help: 'Propensity of the community to tackle change and undertake common projects (0 poor; 5 optimal)',
            type: 'graph'
        },
        "time_to_build_effective_shared_knowledge": {
            title: 'Time to build shared knowledge and values',
            label: '',
            xRange: [0, 40],
            yRange: [0, 5],
            defaultValue: [],
            help: 'Time to build shared knowledge and values, as a function of the proportion of newcomers',
            type: 'graph'
        },
        "inst_support_evolution": {
            title: 'Investment into entrepreneurship and innovation',
            label: '',
            xRange: [2022, 2041],
            yRange: [0, 3000000],
            defaultValue: [],
            help: 'Yearly budget applied to support entrepreneurs and new initiatives in €',
            type: 'graph'
        }
    },
    "visualizations": {
        "service_jobs": "Service jobs",
        "Industrial_jobs": "Industrial jobs",
        "agriculture_jobs": "Agricultural jobs",
        "WORKING_AGE_POPULATION": "Working age population"
    }
}