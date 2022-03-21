export const DefaultConfig0 = {
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

export const DefaultConfig = {
    "modelName": "default_model",
    "parameters": {
        "AKIS_evolution": {
            "defaultValue": {
                "data": [
                ],
                "index": [
                ]
            },
            "help": "Agricultural Knowledge and Innovation System (AKIS) is a concept to describe the exchange of knowledge and the services which support these exchanges in rural areas. 0 = ineffective relationships, 5 optimal relationships",
            "label": "Strength of relationship between actors in agricultural value chains government, science, industry and production",
            "max": "5",
            "min": "0",
            "order": "600",
            "title": "Evolution of AKIS over time",
            "tmax": "2040",
            "tmin": "2020",
            "type": "graph"
        },
        "Drop_in_the_service_average_life_due_to_COVID": {
            "defaultValue": {
                "data": [
                ],
                "index": [
                ]
            },
            "help": "Impact of COVID-19 on service businesses expressed as a drop in the expected lifespan of the business per year during the simulation period. 0 means that the lifespan is not impacted, 10 means that the expected lifespan is reduced by 10 years.",
            "label": "Reduced life span in years",
            "max": "10",
            "min": "0",
            "order": "165",
            "title": "Drop in the average life-span of a service business due to COVID",
            "tmax": "2040",
            "tmin": "2020",
            "type": "graph"
        },
        "attraction_ratio_objective": {
            "defaultValue": "11",
            "help": "An attraction ratio objective expresses the influx of tourists to a region as a percentage of the specific potential of the respective region as determined in the model preconditions. 0 means the potential is NOT realized at all, 10 means that 10% of the potential is realized.",
            "label": "Influx of visitors as percentage of potential",
            "max": 10,
            "min": "0",
            "order": "540",
            "title": "Visitors ratio objective",
            "type": "number"
        },
        "average_life_of_a_service_business": {
            "defaultValue": "15",
            "help": "Choose a value between 0 and 30 years. This is the expected value for the end of the simulation period 2041",
            "label": "Life time in years",
            "max": 30,
            "min": 0,
            "order": "160",
            "title": "Average life time of a service business",
            "type": "number"
        },
        "average_life_of_an_industrial_business": {
            "defaultValue": "20",
            "help": "Choose a value between 0 and 30 years. This is the expected value for the end of the simulation period 2041",
            "label": "Life time in years",
            "max": 30,
            "min": 0,
            "order": "150",
            "title": "Average life time of an industrial business",
            "type": "number"
        },
        "cap_ecoschemes": {
            "defaultValue": {
                "data": [
                ],
                "index": [
                ]
            },
            "help": "CAP Eco-schemes aims to boost sustainable agricultural practices. This parameter reflects the implementation of CAP Eco-schemes in the selected model region. Using a scale between 0 and 5 you can simulate variation over time. 0 means that the CAP Eco-schemes are not implemented, 5 means that the CAP Eco-schemes are fully implemented.",
            "label": "The degree to which the CAP Eco-shemes mechanism is implemented in Latvia",
            "max": 5,
            "min": 0,
            "order": "610",
            "title": "Implementation of CAP Eco-schemes",
            "tmax": 2041,
            "tmin": 2022,
            "type": "graph"
        },
        "community_climate": {
            "defaultValue": {
                "data": [
                ],
                "index": [
                ]
            },
            "help": "How effective are communities in the model area in tackling change and undertaking common projects? 0 means poor, 5 is optimal",
            "label": "Effectiveness of communities in tackling change and undertaking common projects",
            "max": 5,
            "min": 0,
            "order": "700",
            "title": "Community climate",
            "tmax": "2042",
            "tmin": "2020",
            "type": "graph"
        },
        "drop_in_the_industrial_average_life_due_to_COVID": {
            "defaultValue": {
                "data": [
                ],
                "index": [
                ]
            },
            "help": "Impact of COVID-19 on industrial businesses expressed as a drop in the expected lifespan of the business per year during the simulation period. 0 means that the lifespan is not impacted, 10 means that the expected lifespan is reduced by 10 years.",
            "label": "Reduced life span in years",
            "max": "10",
            "min": "0",
            "order": "155",
            "title": "Drop in the average life-span of an industrial business due to COVID",
            "tmax": "2040",
            "tmin": "2020",
            "type": "graph"
        },
        "farm_to_fork_effect_on_services": {
            "defaultValue": {
                "data": [
                ],
                "index": [
                ]
            },
            "help": "Farm to fork is an EU strategy to strengthen European agriculture. Polirural has estimated that Farm to Fork could lead to new jobs in the agro-services sector. The realization of these jobs will rely on the effectiveness of the implementation of Farm to Fork.  Using a scale between 0 and 5 you can express the effect of Farm to Fork strategy over time. 0 means no jobs are created, 5 means all potential jobs are created.",
            "label": "The effect of Farm to Fork on the number of people employed in the agricultural services sector",
            "max": 5,
            "min": 0,
            "order": "620",
            "title": "Impact of Farm to Fork",
            "tmax": "2042",
            "tmin": "2020",
            "type": "graph"
        },
        "final_technical_obsolescence_time": {
            "defaultValue": -1,
            "help": "The technical obsolescence time is the time from which a business stops making investments into technology until it is no longer viable. This parameter is affected by climate change, shortening the obsolescence time. 1 means that the business requires investments within one year to remain viable. The value specified here is valid for the end of the simulation",
            "label": "Required frequency of technical investments",
            "max": "15",
            "min": 1,
            "order": "630",
            "title": "Final technical obsolescence time",
            "type": "number"
        },
        "infrastructures_objective": {
            "defaultValue": "9647",
            "help": "",
            "label": "Kilometres of new roads",
            "max": "1000000000000",
            "min": "0",
            "order": "520",
            "title": "Infrastructure objective",
            "type": "number"
        },
        "inst_support_evolution": {
            "defaultValue": {
                "data": [
                ],
                "index": [
                ]
            },
            "help": "Yearly budget applied to support entrepreneurs and new initiatives in €",
            "label": "",
            "max": 3000000,
            "min": 0,
            "order": "640",
            "parameter": "inst_support_evolution",
            "title": "Investment into entrepreneurship and innovation",
            "tmax": "2042",
            "tmin": "2020",
            "type": "graph"
        },
        "life_expectancy_drop_2020_-_2022": {
            "defaultValue": -1,
            "help": "The drop in life expectancy caused by COVID-19 from 2020-2022.  ",
            "label": "Reduced in life expectancy in years",
            "max": "2",
            "min": "0",
            "order": "200",
            "title": "Drop in life-expectancy due to COVID-19",
            "type": "number"
        },
        "natural_land_objective": {
            "defaultValue": "146576",
            "help": "Natural land is expressed in hectares. The natural land area should stand in a reasonable relationship to the current amount of natural land and must not exceed the area of the model area.",
            "label": "Area in hectares",
            "max": "1000000000000",
            "min": "0",
            "order": "550",
            "title": "Natural land objective",
            "type": "number"
        },
        "population_covered_objective": {
            "defaultValue": "82",
            "help": "Enter the envisioned broadband coverage in 2041 as a percentage of the total population",
            "label": "Percentage of population with access to broadband internet connectivity by 2041",
            "max": 100,
            "min": 65,
            "order": "530",
            "title": "Broadband coverage",
            "type": "number"
        },
        "time_for_infrastructure_campaign_extension": {
            "defaultValue": "10",
            "help": "The time in years until the infrastructure objective is achieved",
            "label": "Time in years",
            "max": "10",
            "min": "1",
            "order": "527",
            "title": "Time to achieve infrastructure objective",
            "type": "number"
        },
        "time_to_build_effective_shared_knowledge": {
            "defaultValue": {
                "data": [
                ],
                "index": [
                ]
            },
            "help": "Time to build shared knowledge and values, as a function of the proportion of newcomers. The vertical axis expresses the time in years, the horizontal axis expresses the percentage of newcomers",
            "label": "Time to build shared knowledge and values, as a function of the proportion of newcomers",
            "max": 5,
            "min": 0,
            "order": "699",
            "title": "Time to build shared knowledge and values",
            "tmax": "40",
            "tmin": 0,
            "type": "graph"
        },
        "time_to_complete_broadband_campaign": {
            "defaultValue": "9",
            "help": "The time it takes to implement broadband campaign",
            "label": "Time in years",
            "max": 10,
            "min": 1,
            "order": "535",
            "title": "Time to complete broadband campaign",
            "type": "number"
        },
        "time_to_complete_campaign": {
            "defaultValue": "8",
            "help": "The time it will take in years to arrive at the target ratio for visitors as expressed in \"Influx of visitors as percentage of potential\"",
            "label": "Time in years",
            "max": 10,
            "min": 1,
            "order": "545",
            "title": "Time to complete tourism campaign",
            "type": "number"
        },
        "university_students_objective": {
            "defaultValue": "37",
            "help": "The sum of people starting university and people starting vocational training must be equal to or less than 100. The remainder is counted as \"unskilled workers\"",
            "label": "Percentage of students starting university as a fraction of students completing \"school\"",
            "max": 60,
            "min": 15,
            "order": "250",
            "title": "University education",
            "type": "number"
        },
        "vt_fraction_objective": {
            "defaultValue": "29",
            "help": "The sum of people starting university and people starting vocational training must be equal to or less than 100. The remainder is counted as \"unskilled workers\"",
            "label": "Percentage of students starting vocational training as a fraction of students completing \"school\"",
            "max": 85,
            "min": 40,
            "order": "255",
            "title": "Vocational training",
            "type": "number"
        },
        "year_initiating_broadband_plan": {
            "defaultValue": "2010",
            "help": "Year when broad band plan is initiated",
            "label": "Start year",
            "max": "2040",
            "min": "2022",
            "order": "532",
            "title": "Start year for broadband plan",
            "type": "number"
        },
        "year_initiating_infrastructures_plan": {
            "defaultValue": "2021",
            "help": "The year when the infrastructure investment plan is initiated",
            "label": "Year",
            "max": "2040",
            "min": "2022",
            "order": "525",
            "title": "Start year for infrastructure plan",
            "type": "number"
        },
        "years_for_completing_natural_land_objective": {
            "defaultValue": "9",
            "help": "The number of years it will take until the natural land objective is achieved.",
            "label": "Time in years",
            "max": "10",
            "min": "1",
            "order": "555",
            "title": "Time to achieve natural land area objective",
            "type": "number"
        }
    },
    "title": "SDM model (default config)",
    "visualizations": {
        "ELDERLY_POPULATION": "Population over 65 (70) years",
        "INFANTS": "Population between 0 and 5 years",
        "NEWCOMERS": "Population arriving in the pilot area",
        "Natural_Capital": "Natural capital expressed in ha equivalent",
        "POST_SCHOOL_POPULATION": "Population between 15 and 20 years",
        "Rest_of_primary_sector_jobs": "Number of jobs in the primary sector excluding agriculture",
        "SCHOOL_AGE_POPULATION": "Population between 5 and 15 years",
        "UNIVERSITY_STUDENTS": "Number of university students",
        "UNSKILLED_WORKERS": "Number of unskilled workers",
        "VT_STUDENTS": "Number of vocational training students",
        "WORKING_AGE_POPULATION": "Working age population",
        "agriculture_jobs": "Agricultural jobs",
        "agriculture_profitability": "Average annual profitability expressed in €/farm",
        "farms": "Total number of farms",
        "mean_local_income_per_farm": "Average annual income per farm (excluding subsidies) in €/farm",
        "service_jobs": "Service jobs",
        "shared_knowledge": "A measure between 0 and 10 expressing knowledge and practices shared by the community",
        "social_innovation": "A measure between 0 and 1 expressing the ability to innovate in a community",
        "total_industrial_jobs": "Number of jobs in the industrial sector",
        "total_rural_population": "Total rural population",
        "total_services_job": "Number of jobs in the services sector",
        "workforce_specialization": "Ratio of trained professionals (vocational training and university) over total jobs"
    }
}

export const VIEW_MODE = {
    WIZARD: "wizard",
    LIST: "list"
}

export const INPUT_PARAMETER_TYPE = {
    NUMBER: "number",
    GRAPH: "graph"
}