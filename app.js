const STORAGE_KEY = 'leagueops-live-nfyll-demo-v1';
const uid = (p='id') => `${p}-${Math.random().toString(36).slice(2,9)}`;
const timestamp = () => new Date().toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});

const seed = {
  "currentLeagueId": "nfyll",
  "selectedTeamId": "t5",
  "leagues": [
    {
      "id": "nfyll",
      "name": "NFYLL",
      "trainer": {
        "name": "Sarah Lopez",
        "location": "Central Tent",
        "status": "Available",
        "respondingTo": ""
      },
      "weather": {
        "active": false,
        "until": "",
        "note": "Fields open",
        "history": [
          {
            "time": "Demo",
            "text": "No active weather delay. Fields open."
          }
        ]
      },
      "fields": [
        {
          "id": "f1",
          "name": "Field 1 Turf",
          "type": "Full Field"
        },
        {
          "id": "f2",
          "name": "Field 2",
          "type": "7v7"
        },
        {
          "id": "f4",
          "name": "Field 4",
          "type": "4v4"
        },
        {
          "id": "f6",
          "name": "Field 6 Turf",
          "type": "Full Field"
        }
      ],
      "teams": [
        {
          "id": "t1",
          "name": "8U Riptide Black",
          "division": "1/2 Grade 4v4",
          "players": []
        },
        {
          "id": "t2",
          "name": "8U Riptide Blue",
          "division": "1/2 Grade 4v4",
          "players": []
        },
        {
          "id": "t3",
          "name": "8U Riptide Gray",
          "division": "1/2 Grade 4v4",
          "players": []
        },
        {
          "id": "t4",
          "name": "8U Riptide White",
          "division": "1/2 Grade 4v4",
          "players": []
        },
        {
          "id": "t5",
          "name": "Creeks Blue  8u",
          "division": "1/2 Grade 4v4",
          "players": [
            {
              "id": "t5-p1",
              "number": 1,
              "name": "Julian Levin",
              "eligibility": "Verified",
              "usaId": "10030239515"
            },
            {
              "id": "t5-p2",
              "number": 2,
              "name": "Tate Wade",
              "eligibility": "Verified",
              "usaId": "10030366938"
            },
            {
              "id": "t5-p3",
              "number": 3,
              "name": "Steven Melendez",
              "eligibility": "Verified",
              "usaId": "10030381711"
            },
            {
              "id": "t5-p4",
              "number": 4,
              "name": "Samuel Gordon",
              "eligibility": "Verified",
              "usaId": "10030256391"
            },
            {
              "id": "t5-p5",
              "number": 5,
              "name": "Hoyt Matthews",
              "eligibility": "Verified",
              "usaId": "10030366380"
            },
            {
              "id": "t5-p6",
              "number": 6,
              "name": "Cade Peterman",
              "eligibility": "Verified",
              "usaId": "10030366659"
            },
            {
              "id": "t5-p7",
              "number": 7,
              "name": "Xander Buck",
              "eligibility": "Verified",
              "usaId": "10030311478"
            },
            {
              "id": "t5-p8",
              "number": 8,
              "name": "Barrett Judah",
              "eligibility": "Verified",
              "usaId": "10030234684"
            },
            {
              "id": "t5-p9",
              "number": 9,
              "name": "Levi Stallcup",
              "eligibility": "Verified",
              "usaId": "10030265450"
            }
          ]
        },
        {
          "id": "t6",
          "name": "Creeks Green 8u",
          "division": "1/2 Grade 4v4",
          "players": [
            {
              "id": "t6-p1",
              "number": 1,
              "name": "Liam Ryan",
              "eligibility": "Verified",
              "usaId": "10030375439"
            },
            {
              "id": "t6-p2",
              "number": 2,
              "name": "graham barron",
              "eligibility": "Verified",
              "usaId": "10030348832"
            },
            {
              "id": "t6-p3",
              "number": 3,
              "name": "Liam Ambrose",
              "eligibility": "Verified",
              "usaId": "15566259"
            },
            {
              "id": "t6-p4",
              "number": 4,
              "name": "Beau Baron",
              "eligibility": "Verified",
              "usaId": "10030359174"
            },
            {
              "id": "t6-p5",
              "number": 5,
              "name": "Liam Kalaher",
              "eligibility": "Verified",
              "usaId": "10030114213"
            },
            {
              "id": "t6-p6",
              "number": 6,
              "name": "Avery Sero",
              "eligibility": "Verified",
              "usaId": "10030237027"
            },
            {
              "id": "t6-p7",
              "number": 7,
              "name": "Rigel Robertson",
              "eligibility": "Verified",
              "usaId": "10030339317"
            },
            {
              "id": "t6-p8",
              "number": 8,
              "name": "William Empey",
              "eligibility": "Verified",
              "usaId": "10030204743"
            },
            {
              "id": "t6-p9",
              "number": 9,
              "name": "James Robert Martin",
              "eligibility": "Verified",
              "usaId": "10030241754"
            }
          ]
        },
        {
          "id": "t7",
          "name": "Fleming Island 1/2",
          "division": "1/2 Grade 4v4",
          "players": []
        },
        {
          "id": "t8",
          "name": "Jax Lax - 8U",
          "division": "1/2 Grade 4v4",
          "players": [
            {
              "id": "t8-p1",
              "number": 1,
              "name": "Ryan Warner",
              "eligibility": "Verified",
              "usaId": "10010951809"
            },
            {
              "id": "t8-p2",
              "number": 2,
              "name": "Bennett Conk",
              "eligibility": "Verified",
              "usaId": "10030232346"
            },
            {
              "id": "t8-p3",
              "number": 3,
              "name": "Don Patrick Jr.",
              "eligibility": "Verified",
              "usaId": "10030265540"
            },
            {
              "id": "t8-p4",
              "number": 4,
              "name": "Silas Rozycki",
              "eligibility": "Verified",
              "usaId": "10030228488"
            },
            {
              "id": "t8-p5",
              "number": 5,
              "name": "judge Jones",
              "eligibility": "Verified",
              "usaId": "10030356732"
            },
            {
              "id": "t8-p6",
              "number": 6,
              "name": "William Berger",
              "eligibility": "Verified",
              "usaId": "10030231215"
            },
            {
              "id": "t8-p7",
              "number": 7,
              "name": "Luke Tight",
              "eligibility": "Verified",
              "usaId": "10030120925"
            },
            {
              "id": "t8-p8",
              "number": 8,
              "name": "Davis Langley",
              "eligibility": "Verified",
              "usaId": "10030265213"
            },
            {
              "id": "t8-p9",
              "number": 9,
              "name": "Baker Langley",
              "eligibility": "Verified",
              "usaId": "10030265212"
            },
            {
              "id": "t8-p10",
              "number": 10,
              "name": "Fischer Hontz",
              "eligibility": "Verified",
              "usaId": "10030351796"
            }
          ]
        },
        {
          "id": "t9",
          "name": "10U Riptide Black",
          "division": "3/4 Grade 7V7",
          "players": []
        },
        {
          "id": "t10",
          "name": "10U Riptide Blue",
          "division": "3/4 Grade 7V7",
          "players": []
        },
        {
          "id": "t11",
          "name": "10U Riptide Gray",
          "division": "3/4 Grade 7V7",
          "players": []
        },
        {
          "id": "t12",
          "name": "10U Riptide Navy",
          "division": "3/4 Grade 7V7",
          "players": []
        },
        {
          "id": "t13",
          "name": "10U Riptide White",
          "division": "3/4 Grade 7V7",
          "players": []
        },
        {
          "id": "t14",
          "name": "Creeks Blue 10u",
          "division": "3/4 Grade 7V7",
          "players": [
            {
              "id": "t14-p1",
              "number": 1,
              "name": "Nathan Jenkins",
              "eligibility": "Verified",
              "usaId": "10030241575"
            },
            {
              "id": "t14-p2",
              "number": 2,
              "name": "Maddox Magwood",
              "eligibility": "Verified",
              "usaId": "10030338361"
            },
            {
              "id": "t14-p3",
              "number": 3,
              "name": "Dean Hardy",
              "eligibility": "Verified",
              "usaId": "10030242111"
            },
            {
              "id": "t14-p4",
              "number": 4,
              "name": "Troy Glenn",
              "eligibility": "Verified",
              "usaId": "10030114864"
            },
            {
              "id": "t14-p5",
              "number": 5,
              "name": "Henry Kray",
              "eligibility": "Verified",
              "usaId": "10030236601"
            },
            {
              "id": "t14-p6",
              "number": 6,
              "name": "Sean Keating",
              "eligibility": "Verified",
              "usaId": "15395740"
            },
            {
              "id": "t14-p7",
              "number": 7,
              "name": "Lucas Webster",
              "eligibility": "Verified",
              "usaId": "10030230795"
            },
            {
              "id": "t14-p8",
              "number": 8,
              "name": "Grey Perschau",
              "eligibility": "Verified",
              "usaId": "10030344091"
            },
            {
              "id": "t14-p9",
              "number": 9,
              "name": "Maverick Smith",
              "eligibility": "Verified",
              "usaId": "10030339400"
            },
            {
              "id": "t14-p10",
              "number": 10,
              "name": "Jude Kalaher",
              "eligibility": "Verified",
              "usaId": "15543078"
            },
            {
              "id": "t14-p11",
              "number": 11,
              "name": "Greyson Voyce",
              "eligibility": "Verified",
              "usaId": "10030152296"
            },
            {
              "id": "t14-p12",
              "number": 12,
              "name": "Oliver Valeriano",
              "eligibility": "Verified",
              "usaId": "10030224085"
            },
            {
              "id": "t14-p13",
              "number": 13,
              "name": "Ryan Jackowiak",
              "eligibility": "Verified",
              "usaId": "10030360040"
            }
          ]
        },
        {
          "id": "t15",
          "name": "Creeks Green 10u",
          "division": "3/4 Grade 7V7",
          "players": [
            {
              "id": "t15-p1",
              "number": 1,
              "name": "Nathan Brown",
              "eligibility": "Verified",
              "usaId": "10030336275"
            },
            {
              "id": "t15-p2",
              "number": 2,
              "name": "Troy Daza",
              "eligibility": "Verified",
              "usaId": "10030242035"
            },
            {
              "id": "t15-p3",
              "number": 3,
              "name": "Gregory Meadows",
              "eligibility": "Verified",
              "usaId": "10030237191"
            },
            {
              "id": "t15-p4",
              "number": 4,
              "name": "Sebastian Lewis",
              "eligibility": "Verified",
              "usaId": "15340428"
            },
            {
              "id": "t15-p5",
              "number": 5,
              "name": "Reed Staley",
              "eligibility": "Verified",
              "usaId": "10030353557"
            },
            {
              "id": "t15-p6",
              "number": 6,
              "name": "Owen Peterman",
              "eligibility": "Verified",
              "usaId": "15530810"
            },
            {
              "id": "t15-p7",
              "number": 7,
              "name": "Jordan Gaieski",
              "eligibility": "Verified",
              "usaId": "10030344663"
            },
            {
              "id": "t15-p8",
              "number": 8,
              "name": "Ethan Warner",
              "eligibility": "Verified",
              "usaId": "10030090733"
            },
            {
              "id": "t15-p9",
              "number": 9,
              "name": "John Rueda",
              "eligibility": "Verified",
              "usaId": "10030366438"
            },
            {
              "id": "t15-p10",
              "number": 10,
              "name": "Alexander Jordan",
              "eligibility": "Verified",
              "usaId": "10030362654"
            },
            {
              "id": "t15-p11",
              "number": 11,
              "name": "Nathan Knight",
              "eligibility": "Verified",
              "usaId": "10030339343"
            },
            {
              "id": "t15-p12",
              "number": 12,
              "name": "Kenneth LaBarbera",
              "eligibility": "Verified",
              "usaId": "10030374222"
            },
            {
              "id": "t15-p13",
              "number": 13,
              "name": "Jaxon Decker",
              "eligibility": "Verified",
              "usaId": "10030239785"
            }
          ]
        },
        {
          "id": "t16",
          "name": "Fleming Island 3/4",
          "division": "3/4 Grade 7V7",
          "players": []
        },
        {
          "id": "t17",
          "name": "Jax Lax - 10U",
          "division": "3/4 Grade 7V7",
          "players": [
            {
              "id": "t17-p1",
              "number": 1,
              "name": "Ryan Warner",
              "eligibility": "Verified",
              "usaId": "10010951809"
            },
            {
              "id": "t17-p2",
              "number": 2,
              "name": "Paul Diorio",
              "eligibility": "Verified",
              "usaId": "15363823"
            },
            {
              "id": "t17-p3",
              "number": 3,
              "name": "Remy Hedberg",
              "eligibility": "Verified",
              "usaId": "15564035"
            },
            {
              "id": "t17-p4",
              "number": 4,
              "name": "Caleb Kramer",
              "eligibility": "Verified",
              "usaId": "15171239"
            },
            {
              "id": "t17-p5",
              "number": 5,
              "name": "Landon McCauley",
              "eligibility": "Verified",
              "usaId": "10030323810"
            },
            {
              "id": "t17-p6",
              "number": 6,
              "name": "Colton McCauley",
              "eligibility": "Verified",
              "usaId": "10030323811"
            },
            {
              "id": "t17-p7",
              "number": 7,
              "name": "Fore Hagan",
              "eligibility": "Verified",
              "usaId": "15549918"
            },
            {
              "id": "t17-p8",
              "number": 8,
              "name": "Ian Jagger",
              "eligibility": "Verified",
              "usaId": "10030071571"
            },
            {
              "id": "t17-p9",
              "number": 9,
              "name": "Walker Skinner",
              "eligibility": "Verified",
              "usaId": "10030370170"
            },
            {
              "id": "t17-p10",
              "number": 10,
              "name": "jack greaker",
              "eligibility": "Verified",
              "usaId": "10030122256"
            },
            {
              "id": "t17-p11",
              "number": 11,
              "name": "Gage McGourty",
              "eligibility": "Verified",
              "usaId": "10030237360"
            },
            {
              "id": "t17-p12",
              "number": 12,
              "name": "Levi Rozycki",
              "eligibility": "Verified",
              "usaId": "10030299975"
            },
            {
              "id": "t17-p13",
              "number": 13,
              "name": "Mick Garrity",
              "eligibility": "Verified",
              "usaId": "10030231101"
            },
            {
              "id": "t17-p14",
              "number": 14,
              "name": "Beckett Dalton",
              "eligibility": "Verified",
              "usaId": "10030244433"
            },
            {
              "id": "t17-p15",
              "number": 15,
              "name": "Chip Sheain",
              "eligibility": "Verified",
              "usaId": "15563580"
            },
            {
              "id": "t17-p16",
              "number": 16,
              "name": "Ty Robinson",
              "eligibility": "Verified",
              "usaId": "10030320826"
            },
            {
              "id": "t17-p17",
              "number": 17,
              "name": "David Reninger",
              "eligibility": "Verified",
              "usaId": "10030236440"
            },
            {
              "id": "t17-p18",
              "number": 18,
              "name": "Lane Hontz",
              "eligibility": "Verified",
              "usaId": "10030120707"
            },
            {
              "id": "t17-p19",
              "number": 19,
              "name": "John Gagis",
              "eligibility": "Verified",
              "usaId": "10030349457"
            }
          ]
        },
        {
          "id": "t18",
          "name": "Jax Lax - 10U Titans",
          "division": "3/4 Grade 7V7",
          "players": []
        },
        {
          "id": "t19",
          "name": "12U Riptide Black",
          "division": "5/6 Grade 10v10",
          "players": []
        },
        {
          "id": "t20",
          "name": "12U Riptide Blue",
          "division": "5/6 Grade 10v10",
          "players": []
        },
        {
          "id": "t21",
          "name": "12U Riptide Gray",
          "division": "5/6 Grade 10v10",
          "players": []
        },
        {
          "id": "t22",
          "name": "12U Riptide Navy",
          "division": "5/6 Grade 10v10",
          "players": []
        },
        {
          "id": "t23",
          "name": "12U Riptide White",
          "division": "5/6 Grade 10v10",
          "players": []
        },
        {
          "id": "t24",
          "name": "Bold City Eagles 12U",
          "division": "5/6 Grade 10v10",
          "players": [
            {
              "id": "t24-p1",
              "number": 1,
              "name": "Abram Staman",
              "eligibility": "Verified",
              "usaId": "10030101213"
            },
            {
              "id": "t24-p2",
              "number": 2,
              "name": "Landen Helquist",
              "eligibility": "Verified",
              "usaId": "15368960"
            },
            {
              "id": "t24-p3",
              "number": 3,
              "name": "Alden Caprita",
              "eligibility": "Verified",
              "usaId": "10030374836"
            },
            {
              "id": "t24-p4",
              "number": 4,
              "name": "Billy Pope",
              "eligibility": "Verified",
              "usaId": "15164319"
            },
            {
              "id": "t24-p5",
              "number": 5,
              "name": "Ben Hartman",
              "eligibility": "Verified",
              "usaId": "15541207"
            },
            {
              "id": "t24-p6",
              "number": 6,
              "name": "John Schmidt",
              "eligibility": "Verified",
              "usaId": "10030383982"
            },
            {
              "id": "t24-p7",
              "number": 7,
              "name": "Reid Patrick",
              "eligibility": "Verified",
              "usaId": "15163473"
            },
            {
              "id": "t24-p8",
              "number": 8,
              "name": "Matthew Patrick",
              "eligibility": "Verified",
              "usaId": "15163474"
            },
            {
              "id": "t24-p9",
              "number": 9,
              "name": "Knox Miller",
              "eligibility": "Verified",
              "usaId": "10030378132"
            },
            {
              "id": "t24-p10",
              "number": 10,
              "name": "JJ Trimble",
              "eligibility": "Verified",
              "usaId": "15368278"
            },
            {
              "id": "t24-p11",
              "number": 11,
              "name": "Finn Gatlin",
              "eligibility": "Verified",
              "usaId": "9504033"
            },
            {
              "id": "t24-p12",
              "number": 12,
              "name": "Bryant Spickelmier",
              "eligibility": "Verified",
              "usaId": "10030114348"
            },
            {
              "id": "t24-p13",
              "number": 13,
              "name": "Tim Herrero",
              "eligibility": "Verified",
              "usaId": "10030319517"
            },
            {
              "id": "t24-p14",
              "number": 14,
              "name": "William Erthal",
              "eligibility": "Verified",
              "usaId": "10030108604"
            },
            {
              "id": "t24-p15",
              "number": 15,
              "name": "Mack Jeans",
              "eligibility": "Verified",
              "usaId": "10030268485"
            },
            {
              "id": "t24-p16",
              "number": 16,
              "name": "Kayde Earrey",
              "eligibility": "Verified",
              "usaId": "10030381853"
            },
            {
              "id": "t24-p17",
              "number": 17,
              "name": "Andrew White",
              "eligibility": "Verified",
              "usaId": "10030374995"
            },
            {
              "id": "t24-p18",
              "number": 18,
              "name": "Andrew McCoy",
              "eligibility": "Verified",
              "usaId": "15117943"
            }
          ]
        },
        {
          "id": "t25",
          "name": "Creeks Blue 12u",
          "division": "5/6 Grade 10v10",
          "players": [
            {
              "id": "t25-p1",
              "number": 1,
              "name": "Jack Gibbons",
              "eligibility": "Verified",
              "usaId": "10030362605"
            },
            {
              "id": "t25-p2",
              "number": 2,
              "name": "Campbell Perschau",
              "eligibility": "Verified",
              "usaId": "15530214"
            },
            {
              "id": "t25-p3",
              "number": 3,
              "name": "Charlie Haviland",
              "eligibility": "Verified",
              "usaId": "10030224057"
            },
            {
              "id": "t25-p4",
              "number": 4,
              "name": "Grayson Sargent",
              "eligibility": "Verified",
              "usaId": "10030072870"
            },
            {
              "id": "t25-p5",
              "number": 5,
              "name": "Wyatt Hinkel",
              "eligibility": "Verified",
              "usaId": "15163394"
            },
            {
              "id": "t25-p6",
              "number": 6,
              "name": "Charlie Sheils",
              "eligibility": "Verified",
              "usaId": "10030339356"
            },
            {
              "id": "t25-p7",
              "number": 7,
              "name": "Xavier Owens",
              "eligibility": "Verified",
              "usaId": "15319429"
            },
            {
              "id": "t25-p8",
              "number": 8,
              "name": "Gabriel Webb",
              "eligibility": "Verified",
              "usaId": "15159143"
            },
            {
              "id": "t25-p9",
              "number": 9,
              "name": "James Keating",
              "eligibility": "Verified",
              "usaId": "15395736"
            },
            {
              "id": "t25-p10",
              "number": 10,
              "name": "Brycen Judah",
              "eligibility": "Verified",
              "usaId": "10030234685"
            },
            {
              "id": "t25-p11",
              "number": 11,
              "name": "Nicolas Boiani",
              "eligibility": "Verified",
              "usaId": "10030354084"
            },
            {
              "id": "t25-p12",
              "number": 12,
              "name": "Hudson Gunby",
              "eligibility": "Verified",
              "usaId": "10030356019"
            },
            {
              "id": "t25-p13",
              "number": 13,
              "name": "Brock Sharpe",
              "eligibility": "Verified",
              "usaId": "10030117212"
            },
            {
              "id": "t25-p14",
              "number": 14,
              "name": "Sullivan Ruwe",
              "eligibility": "Verified",
              "usaId": "15508623"
            },
            {
              "id": "t25-p15",
              "number": 15,
              "name": "James Krumholtz",
              "eligibility": "Verified",
              "usaId": "15375514"
            },
            {
              "id": "t25-p16",
              "number": 16,
              "name": "Eli Champion",
              "eligibility": "Verified",
              "usaId": "15526443"
            },
            {
              "id": "t25-p17",
              "number": 17,
              "name": "William Hardy",
              "eligibility": "Verified",
              "usaId": "10030124853"
            },
            {
              "id": "t25-p18",
              "number": 18,
              "name": "Raiden Sexton",
              "eligibility": "Verified",
              "usaId": "10030241656"
            },
            {
              "id": "t25-p19",
              "number": 19,
              "name": "Jackson Daza",
              "eligibility": "Verified",
              "usaId": "15566258"
            },
            {
              "id": "t25-p20",
              "number": 20,
              "name": "Bubba Horrigan",
              "eligibility": "Verified",
              "usaId": "15551796"
            }
          ]
        },
        {
          "id": "t26",
          "name": "Creeks Green 12u",
          "division": "5/6 Grade 10v10",
          "players": [
            {
              "id": "t26-p1",
              "number": 1,
              "name": "Rocco Pollicino",
              "eligibility": "Verified",
              "usaId": "9449510"
            },
            {
              "id": "t26-p2",
              "number": 2,
              "name": "Douglas Bell",
              "eligibility": "Verified",
              "usaId": "10030232737"
            },
            {
              "id": "t26-p3",
              "number": 3,
              "name": "Anthony Kaduck",
              "eligibility": "Verified",
              "usaId": "10030228109"
            },
            {
              "id": "t26-p4",
              "number": 4,
              "name": "Caden Bedard",
              "eligibility": "Verified",
              "usaId": "10030245388"
            },
            {
              "id": "t26-p5",
              "number": 5,
              "name": "Henry Oklevitch",
              "eligibility": "Verified",
              "usaId": "10030338838"
            },
            {
              "id": "t26-p6",
              "number": 6,
              "name": "Christopher Harder",
              "eligibility": "Verified",
              "usaId": "10030222616"
            },
            {
              "id": "t26-p7",
              "number": 7,
              "name": "Ethan Lowe",
              "eligibility": "Verified",
              "usaId": "10030334190"
            },
            {
              "id": "t26-p8",
              "number": 8,
              "name": "Kaiden Faust",
              "eligibility": "Verified",
              "usaId": "10030118644"
            },
            {
              "id": "t26-p9",
              "number": 9,
              "name": "Bode Jutte",
              "eligibility": "Verified",
              "usaId": "10030353587"
            },
            {
              "id": "t26-p10",
              "number": 10,
              "name": "Landon Stallcup",
              "eligibility": "Verified",
              "usaId": "10030242106"
            },
            {
              "id": "t26-p11",
              "number": 11,
              "name": "Raleigh Venier",
              "eligibility": "Verified",
              "usaId": "10030355617"
            },
            {
              "id": "t26-p12",
              "number": 12,
              "name": "Leo Capozzi",
              "eligibility": "Verified",
              "usaId": "15573375"
            },
            {
              "id": "t26-p13",
              "number": 13,
              "name": "Jack Babey",
              "eligibility": "Verified",
              "usaId": "10030106763"
            },
            {
              "id": "t26-p14",
              "number": 14,
              "name": "Bennett Key",
              "eligibility": "Verified",
              "usaId": "10030125975"
            },
            {
              "id": "t26-p15",
              "number": 15,
              "name": "Connor Collins",
              "eligibility": "Verified",
              "usaId": "10030114484"
            },
            {
              "id": "t26-p16",
              "number": 16,
              "name": "Niko Pesavento",
              "eligibility": "Verified",
              "usaId": "10030231658"
            },
            {
              "id": "t26-p17",
              "number": 17,
              "name": "Charles Romanchuk",
              "eligibility": "Verified",
              "usaId": "9565374"
            },
            {
              "id": "t26-p18",
              "number": 18,
              "name": "Adam Rhee",
              "eligibility": "Verified",
              "usaId": "15541856"
            },
            {
              "id": "t26-p19",
              "number": 19,
              "name": "Maddox Buck",
              "eligibility": "Verified",
              "usaId": "15543266"
            },
            {
              "id": "t26-p20",
              "number": 20,
              "name": "Kyle Haire",
              "eligibility": "Verified",
              "usaId": "15535987"
            }
          ]
        },
        {
          "id": "t27",
          "name": "Fleming Island 5/6",
          "division": "5/6 Grade 10v10",
          "players": []
        },
        {
          "id": "t28",
          "name": "Hammerhead",
          "division": "5/6 Grade 10v10",
          "players": [
            {
              "id": "t28-p1",
              "number": 1,
              "name": "Noah Fargo",
              "eligibility": "Verified",
              "usaId": "9668238"
            },
            {
              "id": "t28-p2",
              "number": 2,
              "name": "Obadiah Ely",
              "eligibility": "Verified",
              "usaId": "10030227167"
            },
            {
              "id": "t28-p3",
              "number": 3,
              "name": "Ryker Cook",
              "eligibility": "Verified",
              "usaId": "10030340628"
            },
            {
              "id": "t28-p4",
              "number": 4,
              "name": "Zachary Bietenholz",
              "eligibility": "Verified",
              "usaId": "9594885"
            },
            {
              "id": "t28-p5",
              "number": 5,
              "name": "connell Combs",
              "eligibility": "Verified",
              "usaId": "10030235892"
            },
            {
              "id": "t28-p6",
              "number": 6,
              "name": "Jim McCabe",
              "eligibility": "Verified",
              "usaId": "10030096140"
            },
            {
              "id": "t28-p7",
              "number": 7,
              "name": "Owen Lanigan",
              "eligibility": "Verified",
              "usaId": "10030348192"
            },
            {
              "id": "t28-p8",
              "number": 8,
              "name": "Stanley Jackson",
              "eligibility": "Verified",
              "usaId": "10030247528"
            },
            {
              "id": "t28-p9",
              "number": 9,
              "name": "Benjamin Ferreira",
              "eligibility": "Verified",
              "usaId": "15548813"
            },
            {
              "id": "t28-p10",
              "number": 10,
              "name": "Billy Mooney",
              "eligibility": "Verified",
              "usaId": "15175569"
            },
            {
              "id": "t28-p11",
              "number": 11,
              "name": "Samuel Kinard-Samek",
              "eligibility": "Verified",
              "usaId": "10030138855"
            },
            {
              "id": "t28-p12",
              "number": 12,
              "name": "Kieren Mandt",
              "eligibility": "Verified",
              "usaId": "10030259853"
            },
            {
              "id": "t28-p13",
              "number": 13,
              "name": "Lawton Music",
              "eligibility": "Verified",
              "usaId": "10030357155"
            },
            {
              "id": "t28-p14",
              "number": 14,
              "name": "Elijah Mauch",
              "eligibility": "Verified",
              "usaId": "10030258908"
            },
            {
              "id": "t28-p15",
              "number": 15,
              "name": "Max Rains",
              "eligibility": "Verified",
              "usaId": "10030357698"
            },
            {
              "id": "t28-p16",
              "number": 16,
              "name": "William Michelson",
              "eligibility": "Verified",
              "usaId": "10030098682"
            },
            {
              "id": "t28-p17",
              "number": 17,
              "name": "Foster Russell",
              "eligibility": "Verified",
              "usaId": "15546818"
            },
            {
              "id": "t28-p18",
              "number": 18,
              "name": "John Gilleland",
              "eligibility": "Verified",
              "usaId": "10030360478"
            },
            {
              "id": "t28-p19",
              "number": 19,
              "name": "Silas Morter",
              "eligibility": "Verified",
              "usaId": "9591783"
            },
            {
              "id": "t28-p20",
              "number": 20,
              "name": "Bentlee Chester",
              "eligibility": "Verified",
              "usaId": "15553508"
            },
            {
              "id": "t28-p21",
              "number": 21,
              "name": "Destin Flores",
              "eligibility": "Verified",
              "usaId": "10030290348"
            },
            {
              "id": "t28-p22",
              "number": 22,
              "name": "Zachary Allen",
              "eligibility": "Verified",
              "usaId": "9630350"
            },
            {
              "id": "t28-p23",
              "number": 23,
              "name": "Alex Allen",
              "eligibility": "Verified",
              "usaId": "15364331"
            },
            {
              "id": "t28-p24",
              "number": 24,
              "name": "Jack Brown",
              "eligibility": "Verified",
              "usaId": "10030140298"
            },
            {
              "id": "t28-p25",
              "number": 25,
              "name": "Cooper Fountain",
              "eligibility": "Verified",
              "usaId": "15578031"
            },
            {
              "id": "t28-p26",
              "number": 26,
              "name": "Christopher Brunt",
              "eligibility": "Verified",
              "usaId": "15505667"
            },
            {
              "id": "t28-p27",
              "number": 27,
              "name": "Hanssel Villanueva",
              "eligibility": "Verified",
              "usaId": "10030381535"
            },
            {
              "id": "t28-p28",
              "number": 28,
              "name": "Andrew Avent",
              "eligibility": "Verified",
              "usaId": "10030285239"
            },
            {
              "id": "t28-p29",
              "number": 29,
              "name": "Ethan Fine",
              "eligibility": "Verified",
              "usaId": "10030386192"
            },
            {
              "id": "t28-p30",
              "number": 30,
              "name": "Grady Harrell",
              "eligibility": "Verified",
              "usaId": "15178870"
            },
            {
              "id": "t28-p31",
              "number": 31,
              "name": "Barrett Hazelwood",
              "eligibility": "Verified",
              "usaId": "10030392804"
            }
          ]
        },
        {
          "id": "t29",
          "name": "Jax Lax - 12U",
          "division": "5/6 Grade 10v10",
          "players": [
            {
              "id": "t29-p1",
              "number": 1,
              "name": "Ryan Warner",
              "eligibility": "Verified",
              "usaId": "10010951809"
            },
            {
              "id": "t29-p2",
              "number": 2,
              "name": "Reid Patrick",
              "eligibility": "Verified",
              "usaId": "15163473"
            },
            {
              "id": "t29-p3",
              "number": 3,
              "name": "Matthew Patrick",
              "eligibility": "Verified",
              "usaId": "15163474"
            },
            {
              "id": "t29-p4",
              "number": 4,
              "name": "Charles Diorio",
              "eligibility": "Verified",
              "usaId": "15363822"
            },
            {
              "id": "t29-p5",
              "number": 5,
              "name": "Boston Anderson",
              "eligibility": "Verified",
              "usaId": "10030099853"
            },
            {
              "id": "t29-p6",
              "number": 6,
              "name": "Maverick Weaver",
              "eligibility": "Verified",
              "usaId": "10030388988"
            },
            {
              "id": "t29-p7",
              "number": 7,
              "name": "Elijah Byrd",
              "eligibility": "Verified",
              "usaId": "15266058"
            },
            {
              "id": "t29-p8",
              "number": 8,
              "name": "Knox Hedberg",
              "eligibility": "Verified",
              "usaId": "15152779"
            },
            {
              "id": "t29-p9",
              "number": 9,
              "name": "Teddy Reichold",
              "eligibility": "Verified",
              "usaId": "15340170"
            },
            {
              "id": "t29-p10",
              "number": 10,
              "name": "Owen Reichold",
              "eligibility": "Verified",
              "usaId": "15340172"
            },
            {
              "id": "t29-p11",
              "number": 11,
              "name": "Nicholas Cook",
              "eligibility": "Verified",
              "usaId": "15122677"
            },
            {
              "id": "t29-p12",
              "number": 12,
              "name": "Garrett Shannon",
              "eligibility": "Verified",
              "usaId": "9839496"
            },
            {
              "id": "t29-p13",
              "number": 13,
              "name": "Spencer Arnold",
              "eligibility": "Verified",
              "usaId": "10030125099"
            },
            {
              "id": "t29-p14",
              "number": 14,
              "name": "Gilchrist Berg",
              "eligibility": "Verified",
              "usaId": "15259730"
            },
            {
              "id": "t29-p15",
              "number": 15,
              "name": "Julian Barranco",
              "eligibility": "Verified",
              "usaId": "10030234550"
            },
            {
              "id": "t29-p16",
              "number": 16,
              "name": "Waylon Mularkey",
              "eligibility": "Verified",
              "usaId": "10030207782"
            },
            {
              "id": "t29-p17",
              "number": 17,
              "name": "Jude Garrity",
              "eligibility": "Verified",
              "usaId": "10030231102"
            },
            {
              "id": "t29-p18",
              "number": 18,
              "name": "Roman Maples",
              "eligibility": "Verified",
              "usaId": "10030298570"
            },
            {
              "id": "t29-p19",
              "number": 19,
              "name": "Bear Robinson",
              "eligibility": "Verified",
              "usaId": "10030247546"
            },
            {
              "id": "t29-p20",
              "number": 20,
              "name": "Cooper Burgess",
              "eligibility": "Verified",
              "usaId": "15396559"
            }
          ]
        },
        {
          "id": "t30",
          "name": "RedHawks 12U",
          "division": "5/6 Grade 10v10",
          "players": [
            {
              "id": "t30-p1",
              "number": 1,
              "name": "Finn Nappy",
              "eligibility": "Verified",
              "usaId": "10030336991"
            },
            {
              "id": "t30-p2",
              "number": 2,
              "name": "Oakley Trautwein",
              "eligibility": "Verified",
              "usaId": "15420137"
            },
            {
              "id": "t30-p3",
              "number": 3,
              "name": "Andreas King",
              "eligibility": "Verified",
              "usaId": "15394624"
            },
            {
              "id": "t30-p4",
              "number": 4,
              "name": "Maddox Marsicek",
              "eligibility": "Verified",
              "usaId": "10030310520"
            },
            {
              "id": "t30-p5",
              "number": 5,
              "name": "Carson Mowitz",
              "eligibility": "Verified",
              "usaId": "10030215210"
            },
            {
              "id": "t30-p6",
              "number": 6,
              "name": "Jack Eisenmenger",
              "eligibility": "Verified",
              "usaId": "15556993"
            },
            {
              "id": "t30-p7",
              "number": 7,
              "name": "Leo Alois",
              "eligibility": "Verified",
              "usaId": "15360555"
            },
            {
              "id": "t30-p8",
              "number": 8,
              "name": "Wyatt Deatsman",
              "eligibility": "Verified",
              "usaId": "10030343303"
            },
            {
              "id": "t30-p9",
              "number": 9,
              "name": "James McDonald",
              "eligibility": "Verified",
              "usaId": "15394883"
            },
            {
              "id": "t30-p10",
              "number": 10,
              "name": "Skip McDonald",
              "eligibility": "Verified",
              "usaId": "10030002066"
            },
            {
              "id": "t30-p11",
              "number": 11,
              "name": "Matthew Mitrook",
              "eligibility": "Verified",
              "usaId": "9417116"
            },
            {
              "id": "t30-p12",
              "number": 12,
              "name": "Landon Hoskavich",
              "eligibility": "Verified",
              "usaId": "10030194100"
            },
            {
              "id": "t30-p13",
              "number": 13,
              "name": "Teddy Hines",
              "eligibility": "Verified",
              "usaId": "10030110021"
            },
            {
              "id": "t30-p14",
              "number": 14,
              "name": "Henry Huskins",
              "eligibility": "Verified",
              "usaId": "10030215253"
            },
            {
              "id": "t30-p15",
              "number": 15,
              "name": "Tye Wood",
              "eligibility": "Verified",
              "usaId": "10030377538"
            },
            {
              "id": "t30-p16",
              "number": 16,
              "name": "Bradley Naim",
              "eligibility": "Verified",
              "usaId": "15568399"
            },
            {
              "id": "t30-p17",
              "number": 17,
              "name": "Titan Jones",
              "eligibility": "Verified",
              "usaId": "10030381840"
            },
            {
              "id": "t30-p18",
              "number": 18,
              "name": "Miguel Rodriguez",
              "eligibility": "Verified",
              "usaId": "10030382184"
            },
            {
              "id": "t30-p19",
              "number": 19,
              "name": "Benjamin Greist",
              "eligibility": "Verified",
              "usaId": "10030194255"
            }
          ]
        },
        {
          "id": "t31",
          "name": "14U Riptide Black",
          "division": "7/8 Grade 10V10",
          "players": []
        },
        {
          "id": "t32",
          "name": "14U Riptide Blue",
          "division": "7/8 Grade 10V10",
          "players": []
        },
        {
          "id": "t33",
          "name": "14U Riptide White",
          "division": "7/8 Grade 10V10",
          "players": []
        },
        {
          "id": "t34",
          "name": "Bold City Eagles 14U",
          "division": "7/8 Grade 10V10",
          "players": [
            {
              "id": "t34-p1",
              "number": 1,
              "name": "Robert \"Bobby\" Bizzarri",
              "eligibility": "Verified",
              "usaId": "15374360"
            },
            {
              "id": "t34-p2",
              "number": 2,
              "name": "Gray Athey",
              "eligibility": "Verified",
              "usaId": "9410814"
            },
            {
              "id": "t34-p3",
              "number": 3,
              "name": "Bauer Lewis",
              "eligibility": "Verified",
              "usaId": "9504021"
            },
            {
              "id": "t34-p4",
              "number": 4,
              "name": "Cooper Maszy",
              "eligibility": "Verified",
              "usaId": "10030270975"
            },
            {
              "id": "t34-p5",
              "number": 5,
              "name": "Deacon Roberts",
              "eligibility": "Verified",
              "usaId": "10030365121"
            },
            {
              "id": "t34-p6",
              "number": 6,
              "name": "Tommy Melba",
              "eligibility": "Verified",
              "usaId": "15177610"
            },
            {
              "id": "t34-p7",
              "number": 7,
              "name": "Miles Harden",
              "eligibility": "Verified",
              "usaId": "9504048"
            },
            {
              "id": "t34-p8",
              "number": 8,
              "name": "Matthew Medure",
              "eligibility": "Verified",
              "usaId": "10010486827"
            },
            {
              "id": "t34-p9",
              "number": 9,
              "name": "Ford McKenzie",
              "eligibility": "Verified",
              "usaId": "9504045"
            },
            {
              "id": "t34-p10",
              "number": 10,
              "name": "Brycen Patrick",
              "eligibility": "Verified",
              "usaId": "15163471"
            },
            {
              "id": "t34-p11",
              "number": 11,
              "name": "Kameron Hillgert",
              "eligibility": "Verified",
              "usaId": "10030364110"
            },
            {
              "id": "t34-p12",
              "number": 12,
              "name": "Aiden Pham",
              "eligibility": "Verified",
              "usaId": "10030149642"
            },
            {
              "id": "t34-p13",
              "number": 13,
              "name": "Eli Pham",
              "eligibility": "Verified",
              "usaId": "10030149643"
            },
            {
              "id": "t34-p14",
              "number": 14,
              "name": "Benjamin Jenkins",
              "eligibility": "Verified",
              "usaId": "10030069727"
            },
            {
              "id": "t34-p15",
              "number": 15,
              "name": "Owen Villano",
              "eligibility": "Verified",
              "usaId": "10030382260"
            },
            {
              "id": "t34-p16",
              "number": 16,
              "name": "Hayden Helquist",
              "eligibility": "Verified",
              "usaId": "10030146699"
            },
            {
              "id": "t34-p17",
              "number": 17,
              "name": "Thad Lindsey",
              "eligibility": "Verified",
              "usaId": "9504070"
            },
            {
              "id": "t34-p18",
              "number": 18,
              "name": "Rex Sternberg",
              "eligibility": "Verified",
              "usaId": "10030269857"
            },
            {
              "id": "t34-p19",
              "number": 19,
              "name": "Lincoln Lozowski",
              "eligibility": "Verified",
              "usaId": "10030149683"
            },
            {
              "id": "t34-p20",
              "number": 20,
              "name": "Hunter Dykes",
              "eligibility": "Verified",
              "usaId": "15509252"
            }
          ]
        },
        {
          "id": "t35",
          "name": "Bulldogs LC",
          "division": "7/8 Grade 10V10",
          "players": [
            {
              "id": "t35-p1",
              "number": 1,
              "name": "William Green",
              "eligibility": "Verified",
              "usaId": "010030210778"
            },
            {
              "id": "t35-p2",
              "number": 2,
              "name": "Hunter Kuzon",
              "eligibility": "Verified",
              "usaId": "000015162835"
            },
            {
              "id": "t35-p3",
              "number": 3,
              "name": "Cooper O'Hara",
              "eligibility": "Verified",
              "usaId": "000015164118"
            },
            {
              "id": "t35-p4",
              "number": 4,
              "name": "Dempsey von Goeben",
              "eligibility": "Verified",
              "usaId": "010030044932"
            },
            {
              "id": "t35-p5",
              "number": 5,
              "name": "Walter Kurosko",
              "eligibility": "Verified",
              "usaId": "010030258084"
            },
            {
              "id": "t35-p6",
              "number": 6,
              "name": "Jacob Hurwitz",
              "eligibility": "Verified",
              "usaId": "000015337737"
            },
            {
              "id": "t35-p7",
              "number": 7,
              "name": "Bruce Nawrocki",
              "eligibility": "Verified",
              "usaId": "000015493208"
            },
            {
              "id": "t35-p8",
              "number": 8,
              "name": "Parker Algozzini",
              "eligibility": "Verified",
              "usaId": "010030383800"
            },
            {
              "id": "t35-p9",
              "number": 9,
              "name": "Kipton Emmerich",
              "eligibility": "Verified",
              "usaId": "010030206566"
            },
            {
              "id": "t35-p10",
              "number": 10,
              "name": "John Arrowsmith",
              "eligibility": "Verified",
              "usaId": "000015296352"
            },
            {
              "id": "t35-p11",
              "number": 11,
              "name": "Smith Davis",
              "eligibility": "Verified",
              "usaId": "000015155222"
            },
            {
              "id": "t35-p12",
              "number": 12,
              "name": "Alden Chin",
              "eligibility": "Verified",
              "usaId": "010030234801"
            },
            {
              "id": "t35-p13",
              "number": 13,
              "name": "Graham Hagan",
              "eligibility": "Verified",
              "usaId": "000009504092"
            },
            {
              "id": "t35-p14",
              "number": 14,
              "name": "Gavin Hagan",
              "eligibility": "Verified",
              "usaId": "000009504091"
            },
            {
              "id": "t35-p15",
              "number": 15,
              "name": "Jack Wilson",
              "eligibility": "Verified",
              "usaId": "000015381709"
            },
            {
              "id": "t35-p16",
              "number": 16,
              "name": "Charles Thoele",
              "eligibility": "Verified",
              "usaId": "000009504093"
            },
            {
              "id": "t35-p17",
              "number": 17,
              "name": "Hall Hixon",
              "eligibility": "Verified",
              "usaId": "000015367063"
            },
            {
              "id": "t35-p18",
              "number": 18,
              "name": "Arthur Novais",
              "eligibility": "Verified",
              "usaId": "010030380497"
            },
            {
              "id": "t35-p19",
              "number": 19,
              "name": "Jude Scanlon",
              "eligibility": "Verified",
              "usaId": "000008116797"
            },
            {
              "id": "t35-p20",
              "number": 20,
              "name": "Ben Salari",
              "eligibility": "Verified",
              "usaId": "000015161135"
            },
            {
              "id": "t35-p21",
              "number": 21,
              "name": "Wake Teichert",
              "eligibility": "Verified",
              "usaId": "000015368344"
            },
            {
              "id": "t35-p22",
              "number": 22,
              "name": "Ford Jimerson",
              "eligibility": "Verified",
              "usaId": "000015540429"
            },
            {
              "id": "t35-p23",
              "number": 23,
              "name": "Felipe Soares",
              "eligibility": "Verified",
              "usaId": "000009504067"
            },
            {
              "id": "t35-p24",
              "number": 24,
              "name": "Brendan Cohill",
              "eligibility": "Verified",
              "usaId": "000015158006"
            },
            {
              "id": "t35-p25",
              "number": 25,
              "name": "Beckham Hedberg",
              "eligibility": "Verified",
              "usaId": "000008907581"
            },
            {
              "id": "t35-p26",
              "number": 26,
              "name": "Easton Fanning",
              "eligibility": "Verified",
              "usaId": "000015545149"
            }
          ]
        },
        {
          "id": "t36",
          "name": "Creeks Blue 14u",
          "division": "7/8 Grade 10V10",
          "players": [
            {
              "id": "t36-p1",
              "number": 1,
              "name": "Nathan White",
              "eligibility": "Verified",
              "usaId": "10030369967"
            },
            {
              "id": "t36-p2",
              "number": 2,
              "name": "Mason Blazer",
              "eligibility": "Verified",
              "usaId": "10030011397"
            },
            {
              "id": "t36-p3",
              "number": 3,
              "name": "Dean Boyd",
              "eligibility": "Verified",
              "usaId": "15189464"
            },
            {
              "id": "t36-p4",
              "number": 4,
              "name": "Noah Smith",
              "eligibility": "Verified",
              "usaId": "10030259193"
            },
            {
              "id": "t36-p5",
              "number": 5,
              "name": "Colin Fausey",
              "eligibility": "Verified",
              "usaId": "15534953"
            },
            {
              "id": "t36-p6",
              "number": 6,
              "name": "Blaise Fisher",
              "eligibility": "Verified",
              "usaId": "15597342"
            },
            {
              "id": "t36-p7",
              "number": 7,
              "name": "Greyson Cracknell",
              "eligibility": "Verified",
              "usaId": "9040640"
            },
            {
              "id": "t36-p8",
              "number": 8,
              "name": "Rex Heidelberg",
              "eligibility": "Verified",
              "usaId": "15326590"
            },
            {
              "id": "t36-p9",
              "number": 9,
              "name": "Timothy Shallis",
              "eligibility": "Verified",
              "usaId": "10030191834"
            },
            {
              "id": "t36-p10",
              "number": 10,
              "name": "Michael Tholl",
              "eligibility": "Verified",
              "usaId": "10030255323"
            },
            {
              "id": "t36-p11",
              "number": 11,
              "name": "Emmett ROELING",
              "eligibility": "Verified",
              "usaId": "10030115262"
            },
            {
              "id": "t36-p12",
              "number": 12,
              "name": "Nathaniel Romanchuk",
              "eligibility": "Verified",
              "usaId": "8909636"
            },
            {
              "id": "t36-p13",
              "number": 13,
              "name": "Benjamin Clark",
              "eligibility": "Verified",
              "usaId": "10030109362"
            },
            {
              "id": "t36-p14",
              "number": 14,
              "name": "Karsen Voyce",
              "eligibility": "Verified",
              "usaId": "15468863"
            },
            {
              "id": "t36-p15",
              "number": 15,
              "name": "Barrett Blood",
              "eligibility": "Verified",
              "usaId": "15324074"
            },
            {
              "id": "t36-p16",
              "number": 16,
              "name": "Philip Han",
              "eligibility": "Verified",
              "usaId": "15530085"
            },
            {
              "id": "t36-p17",
              "number": 17,
              "name": "Jack Yowell",
              "eligibility": "Verified",
              "usaId": "15584975"
            },
            {
              "id": "t36-p18",
              "number": 18,
              "name": "Luke Wurtz",
              "eligibility": "Verified",
              "usaId": "10030241121"
            },
            {
              "id": "t36-p19",
              "number": 19,
              "name": "Trent Hinkel",
              "eligibility": "Verified",
              "usaId": "8747484"
            }
          ]
        },
        {
          "id": "t37",
          "name": "Creeks Green 14u",
          "division": "7/8 Grade 10V10",
          "players": [
            {
              "id": "t37-p1",
              "number": 1,
              "name": "Everett Witkowski",
              "eligibility": "Verified",
              "usaId": "10030232253"
            },
            {
              "id": "t37-p2",
              "number": 2,
              "name": "Jack McInerney",
              "eligibility": "Verified",
              "usaId": "15171687"
            },
            {
              "id": "t37-p3",
              "number": 3,
              "name": "Lincoln Herring",
              "eligibility": "Verified",
              "usaId": "15432849"
            },
            {
              "id": "t37-p4",
              "number": 4,
              "name": "Jaxson Buck",
              "eligibility": "Verified",
              "usaId": "10030311477"
            },
            {
              "id": "t37-p5",
              "number": 5,
              "name": "Harrison Welch",
              "eligibility": "Verified",
              "usaId": "9640582"
            },
            {
              "id": "t37-p6",
              "number": 6,
              "name": "Avery Kimener-Krieger",
              "eligibility": "Verified",
              "usaId": "10030313384"
            },
            {
              "id": "t37-p7",
              "number": 7,
              "name": "Grayson Nayock",
              "eligibility": "Verified",
              "usaId": "15354448"
            },
            {
              "id": "t37-p8",
              "number": 8,
              "name": "Taden Biddle",
              "eligibility": "Verified",
              "usaId": "10030358135"
            },
            {
              "id": "t37-p9",
              "number": 9,
              "name": "Parker Shallis",
              "eligibility": "Verified",
              "usaId": "9308681"
            },
            {
              "id": "t37-p10",
              "number": 10,
              "name": "Caleb Causey",
              "eligibility": "Verified",
              "usaId": "10030045849"
            },
            {
              "id": "t37-p11",
              "number": 11,
              "name": "Carter Adams",
              "eligibility": "Verified",
              "usaId": "10030114887"
            },
            {
              "id": "t37-p12",
              "number": 12,
              "name": "Charles Kelley",
              "eligibility": "Verified",
              "usaId": "15522088"
            },
            {
              "id": "t37-p13",
              "number": 13,
              "name": "Jackson Sargent",
              "eligibility": "Verified",
              "usaId": "10030072870"
            },
            {
              "id": "t37-p14",
              "number": 14,
              "name": "Cooper Smith",
              "eligibility": "Verified",
              "usaId": "10030372057"
            },
            {
              "id": "t37-p15",
              "number": 15,
              "name": "William Webster",
              "eligibility": "Verified",
              "usaId": "10030346767"
            },
            {
              "id": "t37-p16",
              "number": 16,
              "name": "Lochlan Timony",
              "eligibility": "Verified",
              "usaId": "15548547"
            },
            {
              "id": "t37-p17",
              "number": 17,
              "name": "Emmett Kalaher",
              "eligibility": "Verified",
              "usaId": "15543078"
            },
            {
              "id": "t37-p18",
              "number": 18,
              "name": "Joshua Webster",
              "eligibility": "Verified",
              "usaId": "10030346766"
            },
            {
              "id": "t37-p19",
              "number": 19,
              "name": "Owen Lane",
              "eligibility": "Verified",
              "usaId": "10030112924"
            }
          ]
        },
        {
          "id": "t38",
          "name": "Fleming Island 7/8",
          "division": "7/8 Grade 10V10",
          "players": []
        },
        {
          "id": "t39",
          "name": "Jax Lax - 14U",
          "division": "7/8 Grade 10V10",
          "players": [
            {
              "id": "t39-p1",
              "number": 1,
              "name": "Ryan Warner",
              "eligibility": "Verified",
              "usaId": "10010951809"
            },
            {
              "id": "t39-p2",
              "number": 2,
              "name": "Nolan ROBERTSON",
              "eligibility": "Verified",
              "usaId": "10030326244"
            },
            {
              "id": "t39-p3",
              "number": 3,
              "name": "Paxton Shannon",
              "eligibility": "Verified",
              "usaId": "9665403"
            },
            {
              "id": "t39-p4",
              "number": 4,
              "name": "Noah Mullins",
              "eligibility": "Verified",
              "usaId": "15164550"
            },
            {
              "id": "t39-p5",
              "number": 5,
              "name": "Reece Bickers",
              "eligibility": "Verified",
              "usaId": "15495295"
            },
            {
              "id": "t39-p6",
              "number": 6,
              "name": "Avery Walker",
              "eligibility": "Verified",
              "usaId": "15360244"
            },
            {
              "id": "t39-p7",
              "number": 7,
              "name": "James Gillette",
              "eligibility": "Verified",
              "usaId": "15263414"
            },
            {
              "id": "t39-p8",
              "number": 8,
              "name": "Jack Tight",
              "eligibility": "Verified",
              "usaId": "15113074"
            },
            {
              "id": "t39-p9",
              "number": 9,
              "name": "Collin McCaffrey",
              "eligibility": "Verified",
              "usaId": "10030350998"
            },
            {
              "id": "t39-p10",
              "number": 10,
              "name": "Benjamin Adams",
              "eligibility": "Verified",
              "usaId": "15294836"
            },
            {
              "id": "t39-p11",
              "number": 11,
              "name": "Stephen starus",
              "eligibility": "Verified",
              "usaId": "15559673"
            },
            {
              "id": "t39-p12",
              "number": 12,
              "name": "Griffin Burgess",
              "eligibility": "Verified",
              "usaId": "10030290892"
            },
            {
              "id": "t39-p13",
              "number": 13,
              "name": "Dean Mercer",
              "eligibility": "Verified",
              "usaId": "15365916"
            },
            {
              "id": "t39-p14",
              "number": 14,
              "name": "Charlie Rabil",
              "eligibility": "Verified",
              "usaId": "9504011"
            }
          ]
        },
        {
          "id": "t40",
          "name": "RedHawks 14U",
          "division": "7/8 Grade 10V10",
          "players": [
            {
              "id": "t40-p1",
              "number": 1,
              "name": "Will Roche",
              "eligibility": "Verified",
              "usaId": "10030306822"
            },
            {
              "id": "t40-p2",
              "number": 2,
              "name": "Ryland Smith",
              "eligibility": "Verified",
              "usaId": "10030187293"
            },
            {
              "id": "t40-p3",
              "number": 3,
              "name": "Koa French",
              "eligibility": "Verified",
              "usaId": "10030186645"
            },
            {
              "id": "t40-p4",
              "number": 4,
              "name": "Braden Trautwein",
              "eligibility": "Verified",
              "usaId": "15571839"
            },
            {
              "id": "t40-p5",
              "number": 5,
              "name": "Mikhai Sesler",
              "eligibility": "Verified",
              "usaId": "10030354533"
            },
            {
              "id": "t40-p6",
              "number": 6,
              "name": "King Britt",
              "eligibility": "Verified",
              "usaId": "10030336805"
            },
            {
              "id": "t40-p7",
              "number": 7,
              "name": "Tristan Jones",
              "eligibility": "Verified",
              "usaId": "10030354987"
            },
            {
              "id": "t40-p8",
              "number": 8,
              "name": "Grayson Sonntag",
              "eligibility": "Verified",
              "usaId": "15360322"
            },
            {
              "id": "t40-p9",
              "number": 9,
              "name": "Cael McCarthy",
              "eligibility": "Verified",
              "usaId": "15268930"
            },
            {
              "id": "t40-p10",
              "number": 10,
              "name": "Austin Kratish",
              "eligibility": "Verified",
              "usaId": "10030114413"
            },
            {
              "id": "t40-p11",
              "number": 11,
              "name": "Walker Hempstead",
              "eligibility": "Verified",
              "usaId": "10030262471"
            },
            {
              "id": "t40-p12",
              "number": 12,
              "name": "Brooks Ruano",
              "eligibility": "Verified",
              "usaId": "15514786"
            },
            {
              "id": "t40-p13",
              "number": 13,
              "name": "Jack Alois",
              "eligibility": "Verified",
              "usaId": "15272807"
            },
            {
              "id": "t40-p14",
              "number": 14,
              "name": "Jack Storoe",
              "eligibility": "Verified",
              "usaId": "15477041"
            },
            {
              "id": "t40-p15",
              "number": 15,
              "name": "Blake Williams",
              "eligibility": "Verified",
              "usaId": "10030364733"
            },
            {
              "id": "t40-p16",
              "number": 16,
              "name": "Owen Edmunds",
              "eligibility": "Verified",
              "usaId": "15317944"
            },
            {
              "id": "t40-p17",
              "number": 17,
              "name": "Spencer D\u2019Auguste",
              "eligibility": "Verified",
              "usaId": "15135121"
            },
            {
              "id": "t40-p18",
              "number": 18,
              "name": "Christian Stevenson",
              "eligibility": "Verified",
              "usaId": "15309549"
            },
            {
              "id": "t40-p19",
              "number": 19,
              "name": "Xander Stevenson",
              "eligibility": "Verified",
              "usaId": "15309548"
            },
            {
              "id": "t40-p20",
              "number": 20,
              "name": "Jack Grobler",
              "eligibility": "Verified",
              "usaId": "8556210"
            },
            {
              "id": "t40-p21",
              "number": 21,
              "name": "Michael Kleinatland",
              "eligibility": "Verified",
              "usaId": "7332492"
            },
            {
              "id": "t40-p22",
              "number": 22,
              "name": "Jack McDonald",
              "eligibility": "Verified",
              "usaId": "10030002067"
            },
            {
              "id": "t40-p23",
              "number": 23,
              "name": "Austin Roscow",
              "eligibility": "Verified",
              "usaId": "9272995"
            },
            {
              "id": "t40-p24",
              "number": 24,
              "name": "Hudson Lewis",
              "eligibility": "Verified",
              "usaId": "15598335"
            },
            {
              "id": "t40-p25",
              "number": 25,
              "name": "Nicholas Zarrinpar",
              "eligibility": "Verified",
              "usaId": "9409156"
            }
          ]
        }
      ],
      "refs": [
        {
          "id": "r1",
          "name": "Tyler Brooks",
          "level": "Level 2",
          "games7v7": 10,
          "gamesModified": 9,
          "gamesFull": 8,
          "notes": "Loaded as demo official."
        },
        {
          "id": "r2",
          "name": "Mason Lee",
          "level": "Level 1",
          "games7v7": 12,
          "gamesModified": 7,
          "gamesFull": 2,
          "notes": "Loaded as demo official."
        },
        {
          "id": "r3",
          "name": "Jake Turner",
          "level": "Level 2",
          "games7v7": 8,
          "gamesModified": 11,
          "gamesFull": 6,
          "notes": "Loaded as demo official."
        }
      ],
      "volunteers": [
        {
          "id": "v1",
          "name": "Megan Packer",
          "role": "Clock"
        },
        {
          "id": "v2",
          "name": "Ashton Packer",
          "role": "Score Table"
        },
        {
          "id": "v3",
          "name": "Amy Packer",
          "role": "Field Marshal"
        }
      ],
      "games": [
        {
          "id": "g1",
          "time": "02/28/2026 \u2022 9:00 AM",
          "homeTeamId": "t22",
          "awayTeamId": "t27",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g2",
          "time": "02/28/2026 \u2022 9:00 AM",
          "homeTeamId": "t16",
          "awayTeamId": "t10",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g3",
          "time": "02/28/2026 \u2022 9:00 AM",
          "homeTeamId": "t5",
          "awayTeamId": "t4",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g4",
          "time": "02/28/2026 \u2022 9:00 AM",
          "homeTeamId": "t31",
          "awayTeamId": "t34",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g5",
          "time": "02/28/2026 \u2022 9:45 AM",
          "homeTeamId": "t7",
          "awayTeamId": "t1",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g6",
          "time": "02/28/2026 \u2022 10:00 AM",
          "homeTeamId": "t19",
          "awayTeamId": "t24",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g7",
          "time": "02/28/2026 \u2022 10:00 AM",
          "homeTeamId": "t17",
          "awayTeamId": "t9",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g8",
          "time": "02/28/2026 \u2022 10:00 AM",
          "homeTeamId": "t35",
          "awayTeamId": "t33",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g9",
          "time": "02/28/2026 \u2022 10:30 AM",
          "homeTeamId": "t8",
          "awayTeamId": "t3",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g10",
          "time": "02/28/2026 \u2022 11:00 AM",
          "homeTeamId": "t25",
          "awayTeamId": "t30",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g11",
          "time": "02/28/2026 \u2022 11:00 AM",
          "homeTeamId": "t11",
          "awayTeamId": "t14",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g12",
          "time": "02/28/2026 \u2022 11:00 AM",
          "homeTeamId": "t32",
          "awayTeamId": "t36",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g13",
          "time": "02/28/2026 \u2022 11:15 AM",
          "homeTeamId": "t2",
          "awayTeamId": "t6",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g14",
          "time": "02/28/2026 \u2022 12:00 PM",
          "homeTeamId": "t29",
          "awayTeamId": "t23",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g15",
          "time": "02/28/2026 \u2022 12:00 PM",
          "homeTeamId": "t15",
          "awayTeamId": "t12",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g16",
          "time": "02/28/2026 \u2022 12:00 PM",
          "homeTeamId": "t40",
          "awayTeamId": "t33",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g17",
          "time": "02/28/2026 \u2022 1:00 PM",
          "homeTeamId": "t26",
          "awayTeamId": "t20",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g18",
          "time": "02/28/2026 \u2022 1:00 PM",
          "homeTeamId": "t13",
          "awayTeamId": "t14",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g19",
          "time": "02/28/2026 \u2022 1:00 PM",
          "homeTeamId": "t37",
          "awayTeamId": "t38",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g20",
          "time": "02/28/2026 \u2022 2:00 PM",
          "homeTeamId": "t21",
          "awayTeamId": "t30",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g21",
          "time": "02/28/2026 \u2022 2:00 PM",
          "homeTeamId": "t39",
          "awayTeamId": "t40",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g22",
          "time": "03/07/2026 \u2022 9:00 AM",
          "homeTeamId": "t26",
          "awayTeamId": "t19",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g23",
          "time": "03/07/2026 \u2022 9:00 AM",
          "homeTeamId": "t10",
          "awayTeamId": "t14",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g24",
          "time": "03/07/2026 \u2022 9:00 AM",
          "homeTeamId": "t4",
          "awayTeamId": "t7",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g25",
          "time": "03/07/2026 \u2022 9:00 AM",
          "homeTeamId": "t39",
          "awayTeamId": "t38",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g26",
          "time": "03/07/2026 \u2022 9:45 AM",
          "homeTeamId": "t3",
          "awayTeamId": "t6",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g27",
          "time": "03/07/2026 \u2022 10:00 AM",
          "homeTeamId": "t28",
          "awayTeamId": "t27",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g28",
          "time": "03/07/2026 \u2022 10:00 AM",
          "homeTeamId": "t15",
          "awayTeamId": "t11",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g29",
          "time": "03/07/2026 \u2022 10:00 AM",
          "homeTeamId": "t31",
          "awayTeamId": "t32",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g30",
          "time": "03/07/2026 \u2022 10:30 AM",
          "homeTeamId": "t1",
          "awayTeamId": "t5",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g31",
          "time": "03/07/2026 \u2022 11:00 AM",
          "homeTeamId": "t30",
          "awayTeamId": "t26",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g32",
          "time": "03/07/2026 \u2022 11:00 AM",
          "homeTeamId": "t18",
          "awayTeamId": "t12",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g33",
          "time": "03/07/2026 \u2022 11:00 AM",
          "homeTeamId": "t28",
          "awayTeamId": "t37",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g34",
          "time": "03/07/2026 \u2022 11:15 AM",
          "homeTeamId": "t2",
          "awayTeamId": "t8",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g35",
          "time": "03/07/2026 \u2022 12:00 PM",
          "homeTeamId": "t28",
          "awayTeamId": "t23",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g36",
          "time": "03/07/2026 \u2022 12:00 PM",
          "homeTeamId": "t17",
          "awayTeamId": "t13",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g37",
          "time": "03/07/2026 \u2022 12:00 PM",
          "homeTeamId": "t40",
          "awayTeamId": "t35",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g38",
          "time": "03/07/2026 \u2022 1:00 PM",
          "homeTeamId": "t30",
          "awayTeamId": "t20",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g39",
          "time": "03/07/2026 \u2022 1:00 PM",
          "homeTeamId": "t16",
          "awayTeamId": "t9",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g40",
          "time": "03/07/2026 \u2022 1:00 PM",
          "homeTeamId": "t36",
          "awayTeamId": "t33",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g41",
          "time": "03/07/2026 \u2022 2:00 PM",
          "homeTeamId": "t29",
          "awayTeamId": "t22",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g42",
          "time": "03/07/2026 \u2022 2:00 PM",
          "homeTeamId": "t40",
          "awayTeamId": "t28",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g43",
          "time": "03/07/2026 \u2022 3:00 PM",
          "homeTeamId": "t25",
          "awayTeamId": "t21",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g44",
          "time": "03/14/2026 \u2022 9:00 AM",
          "homeTeamId": "t19",
          "awayTeamId": "t20",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g45",
          "time": "03/14/2026 \u2022 9:00 AM",
          "homeTeamId": "t9",
          "awayTeamId": "t10",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g46",
          "time": "03/14/2026 \u2022 9:00 AM",
          "homeTeamId": "t4",
          "awayTeamId": "t1",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g47",
          "time": "03/14/2026 \u2022 9:00 AM",
          "homeTeamId": "t31",
          "awayTeamId": "t32",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g48",
          "time": "03/14/2026 \u2022 9:45 AM",
          "homeTeamId": "t2",
          "awayTeamId": "t3",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g49",
          "time": "03/14/2026 \u2022 10:00 AM",
          "homeTeamId": "t21",
          "awayTeamId": "t22",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g50",
          "time": "03/14/2026 \u2022 10:00 AM",
          "homeTeamId": "t11",
          "awayTeamId": "t12",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g51",
          "time": "03/14/2026 \u2022 10:00 AM",
          "homeTeamId": "t36",
          "awayTeamId": "t39",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g52",
          "time": "03/14/2026 \u2022 10:30 AM",
          "homeTeamId": "t7",
          "awayTeamId": "t6",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g53",
          "time": "03/14/2026 \u2022 11:00 AM",
          "homeTeamId": "t25",
          "awayTeamId": "t27",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g54",
          "time": "03/14/2026 \u2022 11:00 AM",
          "homeTeamId": "t17",
          "awayTeamId": "t15",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g55",
          "time": "03/14/2026 \u2022 11:00 AM",
          "homeTeamId": "t37",
          "awayTeamId": "t35",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g56",
          "time": "03/14/2026 \u2022 11:15 AM",
          "homeTeamId": "t8",
          "awayTeamId": "t5",
          "fieldId": "f4",
          "fieldType": "4v4",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g57",
          "time": "03/14/2026 \u2022 12:00 PM",
          "homeTeamId": "t29",
          "awayTeamId": "t26",
          "fieldId": "f1",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g58",
          "time": "03/14/2026 \u2022 12:00 PM",
          "homeTeamId": "t18",
          "awayTeamId": "t16",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g59",
          "time": "03/14/2026 \u2022 12:00 PM",
          "homeTeamId": "t38",
          "awayTeamId": "t36",
          "fieldId": "f6",
          "fieldType": "Full Field",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        },
        {
          "id": "g60",
          "time": "03/14/2026 \u2022 1:00 PM",
          "homeTeamId": "t14",
          "awayTeamId": "t17",
          "fieldId": "f2",
          "fieldType": "7v7",
          "status": "Scheduled",
          "ref1": "OPEN",
          "ref2": "OPEN",
          "clock": "OPEN",
          "score": "OPEN",
          "rosterHomeVerified": false,
          "rosterAwayVerified": false,
          "homeScore": 0,
          "awayScore": 0,
          "warningsHome": 0,
          "warningsAway": 0,
          "ejectionsHome": 0,
          "ejectionsAway": 0,
          "fightOrDisruption": false,
          "disruptionNotes": ""
        }
      ],
      "checkins": [],
      "injuries": [],
      "messages": [
        {
          "id": "m1",
          "time": "Demo",
          "type": "Import",
          "text": "Loaded 40 NFYLL teams from registrations and uploaded rosters."
        },
        {
          "id": "m2",
          "time": "Demo",
          "type": "Schedule",
          "text": "Loaded 60 scheduled games across 4 fields for Feb 28, Mar 7, and Mar 14."
        }
      ]
    },
    {
      "id": "demo",
      "name": "Demo League",
      "trainer": {
        "name": "Open",
        "location": "Main tent",
        "status": "Pending",
        "respondingTo": ""
      },
      "weather": {
        "active": false,
        "until": "",
        "note": "Fields open",
        "history": [
          {
            "time": "Demo",
            "text": "Demo league ready."
          }
        ]
      },
      "fields": [
        {
          "id": "df1",
          "name": "Field A",
          "type": "Full Field"
        }
      ],
      "teams": [],
      "refs": [],
      "volunteers": [],
      "games": [],
      "checkins": [],
      "injuries": [],
      "messages": []
    }
  ]
};

let state = loadState();
let editingGameId = null;

function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(seed);
  } catch {
    return structuredClone(seed);
  }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function league(){ return state.leagues.find(l => l.id === state.currentLeagueId) || state.leagues[0]; }
function team(){ return league().teams.find(t => t.id === state.selectedTeamId) || league().teams[0] || null; }
function teamName(id){ return league().teams.find(t => t.id === id)?.name || 'Open'; }
function fieldName(id){ return league().fields.find(f => f.id === id)?.name || 'Unassigned'; }
function statusClass(status){ return status.toLowerCase().replace(/\s+/g,'-'); }
function totalWarnings(g){ return Number(g.warningsHome||0) + Number(g.warningsAway||0); }
function totalEjections(g){ return Number(g.ejectionsHome||0) + Number(g.ejectionsAway||0); }
function listHTML(items, fallback='Nothing to show.'){
  return items.length ? items.join('') : `<div class="muted">${fallback}</div>`;
}

function initTabs(){
  document.querySelectorAll('#tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tabs button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

function renderLeagueSelect(){
  const select = document.getElementById('leagueSelect');
  select.innerHTML = state.leagues.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
  select.value = state.currentLeagueId;
  select.onchange = () => {
    state.currentLeagueId = select.value;
    if (!league().teams.find(t => t.id === state.selectedTeamId)) state.selectedTeamId = league().teams[0]?.id || null;
    saveState();
    renderAll();
  };
}

function renderHeader(){
  const l = league();
  document.getElementById('trainerName').textContent = `Trainer: ${l.trainer.name || 'Unassigned'}`;
  const trainerBits = [`Location: ${l.trainer.location || '--'}`, `Status: ${l.trainer.status || '--'}`];
  if (l.trainer.respondingTo) trainerBits.push(`Responding To: ${l.trainer.respondingTo}`);
  document.getElementById('trainerMeta').textContent = trainerBits.join(' | ');
  document.getElementById('weatherStatus').textContent = l.weather.active ? 'Weather Delay Active' : 'No Active Delay';
  document.getElementById('weatherMeta').textContent = l.weather.active ? `${l.weather.note} | Until ${l.weather.until || 'TBD'}` : 'Fields open';

  const gaps = l.games.filter(g => [g.ref1,g.ref2,g.clock,g.score].includes('OPEN')).length;
  const conductGames = l.games.filter(g => g.fightOrDisruption || totalWarnings(g) || totalEjections(g)).length;
  const stats = [
    {label:'Games', value:l.games.length},
    {label:'Open Gaps', value:gaps},
    {label:'Warnings', value:l.games.reduce((sum,g)=>sum+totalWarnings(g),0)},
    {label:'Ejections', value:l.games.reduce((sum,g)=>sum+totalEjections(g),0)},
    {label:'Disruptions', value:l.games.filter(g=>g.fightOrDisruption).length},
    {label:'Roster Issues', value:l.games.filter(g=>!g.rosterHomeVerified || !g.rosterAwayVerified).length},
    {label:'Check-Ins', value:l.checkins.length},
    {label:'Conduct Games', value:conductGames}
  ];
  document.getElementById('snapshotStats').innerHTML = stats.map(s => `<div class="stat-tile"><div class="label">${s.label}</div><div class="value">${s.value}</div></div>`).join('');
}

function dashboardGapItems(){
  return league().games.flatMap(g => {
    const items = [];
    if ([g.ref1,g.ref2].includes('OPEN')) items.push(`<div class="log-item"><strong>${g.time}</strong><div>${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}</div><div class="muted">Ref coverage needed</div></div>`);
    if ([g.clock,g.score].includes('OPEN')) items.push(`<div class="log-item"><strong>${g.time}</strong><div>${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}</div><div class="muted">Score table staffing needed</div></div>`);
    return items;
  });
}

function renderDashboard(){
  const l = league();
  document.getElementById('dashboardGaps').innerHTML = listHTML(dashboardGapItems().slice(0,6), 'No staffing gaps right now.');
  document.getElementById('dashboardCheckins').innerHTML = listHTML(
    l.checkins.slice().reverse().slice(0,6).map(c => `<div class="log-item"><strong>${c.time}</strong><div>${c.role} — ${c.name}</div><div class="muted">${c.notes || ''}</div></div>`),
    'No recent check-ins.'
  );
  document.getElementById('dashboardMessages').innerHTML = listHTML(
    l.messages.slice().reverse().slice(0,6).map(m => `<div class="log-item"><strong>${m.time}</strong><div>${m.type}</div><div>${m.text}</div></div>`),
    'No messages yet.'
  );
  const conduct = l.games.filter(g => g.fightOrDisruption || totalWarnings(g) || totalEjections(g));
  document.getElementById('dashboardConduct').innerHTML = listHTML(
    conduct.slice(0,6).map(g => `<div class="log-item"><strong>${g.time}</strong><div>${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}</div><div class="muted">Warnings: ${totalWarnings(g)} | Ejections: ${totalEjections(g)}${g.fightOrDisruption ? ' | Disruption flagged' : ''}</div></div>`),
    'No conduct issues logged.'
  );
}

function gameCard(g){
  const disruption = g.fightOrDisruption ? `<div class="disruption-flag">Fight / disruption flagged${g.disruptionNotes ? ` — ${g.disruptionNotes}` : ''}</div>` : '';
  const rosterPill = (!g.rosterHomeVerified || !g.rosterAwayVerified) ? '<span class="pill alert">Roster Pending</span>' : '<span class="pill">Roster Verified</span>';
  const conductPill = (totalWarnings(g) || totalEjections(g) || g.fightOrDisruption) ? '<span class="pill warn">Conduct Logged</span>' : '';
  return `
    <div class="game-card ${statusClass(g.status)}">
      <div class="game-title">
        <div>
          <h5>${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}</h5>
          <div class="small-meta">${g.time} • ${fieldName(g.fieldId)} • ${g.fieldType}</div>
        </div>
        <div>
          <span class="pill">${g.status}</span>
        </div>
      </div>
      <div class="score-row">
        <div>
          <div class="small-meta">Score Table</div>
          <div class="score-line">${teamName(g.homeTeamId)} ${g.homeScore || 0} — ${g.awayScore || 0} ${teamName(g.awayTeamId)}</div>
        </div>
        <div class="small-meta">Recorder: ${g.score || 'OPEN'}</div>
      </div>
      <div class="conduct-row">
        <div class="conduct-cell"><strong>Home</strong><div>Warnings: ${g.warningsHome || 0}</div><div>Ejections: ${g.ejectionsHome || 0}</div></div>
        <div class="conduct-cell"><strong>Away</strong><div>Warnings: ${g.warningsAway || 0}</div><div>Ejections: ${g.ejectionsAway || 0}</div></div>
      </div>
      ${disruption}
      <div class="details-grid small-meta">
        <div>Ref 1: ${g.ref1 || 'OPEN'}</div>
        <div>Ref 2: ${g.ref2 || 'OPEN'}</div>
        <div>Clock: ${g.clock || 'OPEN'}</div>
        <div>Score Table: ${g.score || 'OPEN'}</div>
      </div>
      <div class="inline-actions">${rosterPill}${conductPill}</div>
      <div class="game-actions">
        <button data-edit-game="${g.id}">Edit / Score</button>
        <button class="ghost" data-toggle-home="${g.id}">${g.rosterHomeVerified ? 'Home Verified' : 'Verify Home'}</button>
        <button class="ghost" data-toggle-away="${g.id}">${g.rosterAwayVerified ? 'Away Verified' : 'Verify Away'}</button>
      </div>
    </div>`;
}

function renderBoard(){
  const l = league();
  document.getElementById('availableRefs').innerHTML = listHTML(
    l.refs.map(r => `<div class="person-chip"><strong>${r.name}</strong><div class="muted">${r.level}</div></div>`),
    'No referees loaded.'
  );
  document.getElementById('availableVolunteers').innerHTML = listHTML(
    l.volunteers.map(v => `<div class="person-chip"><strong>${v.name}</strong><div class="muted">${v.role}</div></div>`),
    'No volunteers loaded.'
  );
  document.getElementById('staffingGaps').innerHTML = listHTML(dashboardGapItems().slice(0,10), 'No current staffing gaps.');
  const board = document.getElementById('fieldBoard');
  board.innerHTML = l.fields.map(f => `
    <div class="field-column">
      <h4>${f.name}</h4>
      <div class="field-meta">${f.type}</div>
      <div class="game-stack">${listHTML(l.games.filter(g => g.fieldId === f.id).map(gameCard), 'No games assigned.')}</div>
    </div>`).join('');
  board.querySelectorAll('[data-edit-game]').forEach(btn => btn.onclick = () => openGameDialog(btn.dataset.editGame));
  board.querySelectorAll('[data-toggle-home]').forEach(btn => btn.onclick = () => toggleVerification(btn.dataset.toggleHome, 'home'));
  board.querySelectorAll('[data-toggle-away]').forEach(btn => btn.onclick = () => toggleVerification(btn.dataset.toggleAway, 'away'));
}

function renderSiteOps(){
  const l = league();
  const summary = [
    `<div class="site-item"><strong>League</strong><div class="muted">${l.name}</div></div>`,
    `<div class="site-item"><strong>Trainer</strong><div class="muted">${l.trainer.name} • ${l.trainer.status}${l.trainer.respondingTo ? ` • ${l.trainer.respondingTo}` : ''}</div></div>`,
    `<div class="site-item"><strong>Weather</strong><div class="muted">${l.weather.active ? `Delay until ${l.weather.until}` : 'Open'}</div></div>`,
    `<div class="site-item"><strong>Conduct</strong><div class="muted">Warnings ${l.games.reduce((s,g)=>s+totalWarnings(g),0)} • Ejections ${l.games.reduce((s,g)=>s+totalEjections(g),0)} • Disruptions ${l.games.filter(g=>g.fightOrDisruption).length}</div></div>`
  ];
  document.getElementById('siteOpsSummary').innerHTML = summary.join('');
  document.getElementById('fieldStatusList').innerHTML = l.fields.map(f => {
    const games = l.games.filter(g => g.fieldId === f.id);
    const scoreReady = games.filter(g => g.score !== 'OPEN').length;
    return `<div class="site-item"><strong>${f.name}</strong><div class="muted">${games.length} games • Score table staffed ${scoreReady}/${games.length || 0}</div></div>`;
  }).join('');
}

function renderCheckins(){
  document.getElementById('checkinLog').innerHTML = listHTML(
    league().checkins.slice().reverse().map(c => `<div class="log-item"><strong>${c.time}</strong><div>${c.role} — ${c.name}</div><div class="muted">${c.notes || ''}</div></div>`),
    'No check-ins yet.'
  );
}

function renderRosters(){
  const l = league();
  const teamList = document.getElementById('teamList');
  teamList.innerHTML = l.teams.map(t => `<button class="ghost ${state.selectedTeamId===t.id?'active-team':''}" data-team-id="${t.id}">${t.name}<div class="muted">${t.division}</div></button>`).join('');
  teamList.querySelectorAll('[data-team-id]').forEach(btn => btn.onclick = () => {
    state.selectedTeamId = btn.dataset.teamId; saveState(); renderRosters();
  });
  const t = team();
  document.getElementById('rosterTitle').textContent = t ? `${t.name} Roster` : 'Roster';
  document.getElementById('playerCards').innerHTML = t && t.players.length ? t.players.map(p => `
    <div class="player-card">
      <strong>#${p.number} ${p.name}</strong>
      <div>${t.name}</div>
      <div class="muted">Eligibility: ${p.eligibility}</div>
      <div class="muted">USA ID: ${p.usaId || '--'}</div>
    </div>`).join('') : '<div class="muted">No players added.</div>';
}

function renderVerification(){
  const list = league().games.map(g => `
    <div class="verification-item">
      <strong>${g.time} — ${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}</strong>
      <div class="muted">${fieldName(g.fieldId)}</div>
      <div class="inline-actions">
        <button class="ghost" data-toggle-home="${g.id}">${g.rosterHomeVerified ? 'Home Verified' : 'Verify Home'}</button>
        <button class="ghost" data-toggle-away="${g.id}">${g.rosterAwayVerified ? 'Away Verified' : 'Verify Away'}</button>
      </div>
    </div>`);
  document.getElementById('verificationList').innerHTML = listHTML(list, 'No games loaded.');
  document.querySelectorAll('#verification [data-toggle-home]').forEach(btn => btn.onclick = () => toggleVerification(btn.dataset.toggleHome, 'home'));
  document.querySelectorAll('#verification [data-toggle-away]').forEach(btn => btn.onclick = () => toggleVerification(btn.dataset.toggleAway, 'away'));
}

function renderRefs(){
  document.getElementById('refDevelopmentList').innerHTML = listHTML(
    league().refs.map(r => {
      const total = Number(r.games7v7||0)+Number(r.gamesModified||0)+Number(r.gamesFull||0);
      return `<div class="log-item"><strong>${r.name}</strong><div>${r.level}</div><div class="muted">7v7: ${r.games7v7} • Modified: ${r.gamesModified} • Full: ${r.gamesFull} • Total: ${total}</div><div class="muted">${r.notes || ''}</div></div>`;
    }),
    'No referees added.'
  );
}

function renderInjuries(){
  const l = league();
  const teamSelect = document.getElementById('injuryTeam');
  const fieldSelect = document.getElementById('injuryField');
  teamSelect.innerHTML = l.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  fieldSelect.innerHTML = l.fields.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
  document.getElementById('injuryLog').innerHTML = listHTML(
    l.injuries.slice().reverse().map(i => `<div class="log-item"><strong>${i.time}</strong><div>${i.player} • ${teamName(i.teamId)} • ${fieldName(i.fieldId)}</div><div class="muted">${i.type} • ${i.severity}</div><div class="muted">${i.notes || ''}</div></div>`),
    'No injuries reported.'
  );
}

function renderWeather(){
  document.getElementById('weatherHistory').innerHTML = listHTML(
    league().weather.history.slice().reverse().map(h => `<div class="log-item"><strong>${h.time}</strong><div>${h.text}</div></div>`),
    'No weather events logged.'
  );
}

function renderComms(){
  document.getElementById('messageLog').innerHTML = listHTML(
    league().messages.slice().reverse().map(m => `<div class="log-item"><strong>${m.time}</strong><div>${m.type}</div><div>${m.text}</div></div>`),
    'No messages yet.'
  );
}

function renderAll(){
  renderLeagueSelect();
  renderHeader();
  renderDashboard();
  renderBoard();
  renderSiteOps();
  renderCheckins();
  renderRosters();
  renderVerification();
  renderRefs();
  renderInjuries();
  renderWeather();
  renderComms();
}

function toggleVerification(gameId, side){
  const g = league().games.find(x => x.id === gameId);
  if (!g) return;
  if (side === 'home') g.rosterHomeVerified = !g.rosterHomeVerified;
  if (side === 'away') g.rosterAwayVerified = !g.rosterAwayVerified;
  league().messages.push({id:uid('m'), time:timestamp(), type:'Roster', text:`${teamName(side === 'home' ? g.homeTeamId : g.awayTeamId)} ${side} roster ${side === 'home' ? g.rosterHomeVerified : g.rosterAwayVerified ? 'verified' : 'marked pending'}.`});
  saveState();
  renderAll();
}

function openGameDialog(gameId){
  editingGameId = gameId;
  const l = league();
  const g = l.games.find(x => x.id === gameId);
  if (!g) return;
  gameHomeInput.innerHTML = l.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  gameAwayInput.innerHTML = l.teams.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  gameFieldInput.innerHTML = l.fields.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
  gameTimeInput.value = g.time;
  gameHomeInput.value = g.homeTeamId;
  gameAwayInput.value = g.awayTeamId;
  gameFieldInput.value = g.fieldId;
  gameFieldTypeInput.value = g.fieldType;
  gameStatusInput.value = g.status;
  gameRef1Input.value = g.ref1;
  gameRef2Input.value = g.ref2;
  gameClockInput.value = g.clock;
  gameScoreInput.value = g.score;
  gameHomeScoreInput.value = g.homeScore || 0;
  gameAwayScoreInput.value = g.awayScore || 0;
  gameWarningsHomeInput.value = g.warningsHome || 0;
  gameWarningsAwayInput.value = g.warningsAway || 0;
  gameEjectionsHomeInput.value = g.ejectionsHome || 0;
  gameEjectionsAwayInput.value = g.ejectionsAway || 0;
  gameFightInput.checked = !!g.fightOrDisruption;
  gameDisruptionNotesInput.value = g.disruptionNotes || '';
  gameDialog.showModal();
}

function startDelay(untilVal, noteVal){
  const l = league();
  const until = untilVal || prompt('Delay until?', l.weather.until || '10:45 AM') || '';
  const note = noteVal || prompt('Delay note', l.weather.note === 'Fields open' ? 'Lightning within 8 miles' : l.weather.note) || 'Weather hold';
  l.weather.active = true;
  l.weather.until = until;
  l.weather.note = note;
  l.weather.history.push({time:timestamp(), text:`Delay active until ${until}. ${note}`});
  l.messages.push({id:uid('m'), time:timestamp(), type:'Weather', text:`Delay active until ${until}. ${note}`});
  saveState();
  renderAll();
}

function resumePlay(){
  const l = league();
  l.weather.active = false;
  l.weather.until = '';
  l.weather.note = 'Fields open';
  l.weather.history.push({time:timestamp(), text:'Weather delay cleared. Resume play.'});
  l.messages.push({id:uid('m'), time:timestamp(), type:'Weather', text:'Weather delay cleared. Resume play.'});
  saveState();
  renderAll();
}

function bindActions(){
  document.getElementById('exportBtn').onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leagueops-live-data.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  document.getElementById('resetBtn').onclick = () => {
    if (confirm('Reset demo data?')) {
      state = structuredClone(seed);
      saveState();
      renderAll();
    }
  };
  document.getElementById('setTrainerBtn').onclick = () => {
    const name = prompt('Trainer name', league().trainer.name || '');
    if (name !== null) {
      league().trainer.name = name || 'Unassigned';
      saveState();
      renderAll();
    }
  };
  document.getElementById('trainerRespondBtn').onclick = () => {
    const loc = prompt('Responding to which field?', league().trainer.respondingTo || '');
    if (loc !== null) {
      league().trainer.respondingTo = loc;
      league().trainer.status = 'Responding';
      league().messages.push({id:uid('m'), time:timestamp(), type:'Trainer', text:`Trainer responding to ${loc}`});
      saveState();
      renderAll();
    }
  };
  document.getElementById('trainerClearBtn').onclick = () => {
    league().trainer.respondingTo = '';
    league().trainer.status = 'Available';
    saveState();
    renderAll();
  };
  document.getElementById('startDelayBtn').onclick = () => startDelay();
  document.getElementById('resumePlayBtn').onclick = () => resumePlay();
  document.getElementById('startDelayFromFormBtn').onclick = () => startDelay(delayUntilInput.value, delayNoteInput.value);
  document.getElementById('resumeFromFormBtn').onclick = () => resumePlay();

  document.getElementById('checkinSubmitBtn').onclick = () => {
    const name = checkinName.value.trim();
    if (!name) return;
    league().checkins.push({id:uid('c'), time:timestamp(), role:checkinRole.value, name, notes:checkinNotes.value.trim()});
    checkinName.value = '';
    checkinNotes.value = '';
    saveState();
    renderAll();
  };

  document.getElementById('sendMessageBtn').onclick = () => {
    const text = messageText.value.trim();
    if (!text) return;
    league().messages.push({id:uid('m'), time:timestamp(), type:messageType.value, text});
    messageText.value = '';
    saveState();
    renderAll();
  };

  document.getElementById('saveRefBtn').onclick = () => {
    const name = refName.value.trim();
    if (!name) return;
    league().refs.push({
      id:uid('r'),
      name,
      level:refLevel.value,
      games7v7:Number(ref7v7.value || 0),
      gamesModified:Number(refModified.value || 0),
      gamesFull:Number(refFull.value || 0),
      notes:refNotes.value.trim()
    });
    refName.value = refNotes.value = '';
    ref7v7.value = refModified.value = refFull.value = 0;
    saveState();
    renderAll();
  };

  document.getElementById('saveInjuryBtn').onclick = () => {
    const player = injuryPlayer.value.trim();
    if (!player) return;
    league().injuries.push({
      id:uid('i'),
      time:timestamp(),
      player,
      teamId:injuryTeam.value,
      fieldId:injuryField.value,
      severity:injurySeverity.value,
      type:injuryType.value,
      notes:injuryNotes.value.trim()
    });
    injuryPlayer.value = injuryNotes.value = '';
    league().messages.push({id:uid('m'), time:timestamp(), type:'Site Alert', text:`Injury reported for ${player} on ${fieldName(injuryField.value)}.`});
    saveState();
    renderAll();
  };

  document.getElementById('addTeamBtn').onclick = () => {
    const name = prompt('Team name');
    if (!name) return;
    const division = prompt('Division', '14U') || '14U';
    const t = {id:uid('t'), name, division, players:[]};
    league().teams.push(t);
    state.selectedTeamId = t.id;
    saveState();
    renderAll();
  };

  document.getElementById('addPlayerBtn').onclick = () => {
    const t = team();
    if (!t) return;
    const name = prompt('Player name');
    if (!name) return;
    const number = prompt('Jersey number', '0') || '0';
    const usaId = prompt('USA Lacrosse ID', '') || '';
    t.players.push({id:uid('p'), number, name, eligibility:'Pending', usaId});
    saveState();
    renderAll();
  };

  document.getElementById('addGameBtn').onclick = () => {
    const l = league();
    const home = l.teams[0]?.id, away = l.teams[1]?.id, field = l.fields[0]?.id;
    if (!home || !away || !field) return;
    l.games.push({id:uid('g'), time:'12:00 PM', homeTeamId:home, awayTeamId:away, fieldId:field, fieldType:fieldName(field), status:'Missing Staff', ref1:'OPEN', ref2:'OPEN', clock:'OPEN', score:'OPEN', rosterHomeVerified:false, rosterAwayVerified:false, homeScore:0, awayScore:0, warningsHome:0, warningsAway:0, ejectionsHome:0, ejectionsAway:0, fightOrDisruption:false, disruptionNotes:''});
    saveState();
    renderAll();
  };

  document.getElementById('saveGameBtn').onclick = (e) => {
    e.preventDefault();
    const g = league().games.find(x => x.id === editingGameId);
    if (!g) return;
    const previousDisruption = g.fightOrDisruption;
    g.time = gameTimeInput.value;
    g.homeTeamId = gameHomeInput.value;
    g.awayTeamId = gameAwayInput.value;
    g.fieldId = gameFieldInput.value;
    g.fieldType = gameFieldTypeInput.value;
    g.status = gameStatusInput.value;
    g.ref1 = gameRef1Input.value || 'OPEN';
    g.ref2 = gameRef2Input.value || 'OPEN';
    g.clock = gameClockInput.value || 'OPEN';
    g.score = gameScoreInput.value || 'OPEN';
    g.homeScore = Number(gameHomeScoreInput.value || 0);
    g.awayScore = Number(gameAwayScoreInput.value || 0);
    g.warningsHome = Number(gameWarningsHomeInput.value || 0);
    g.warningsAway = Number(gameWarningsAwayInput.value || 0);
    g.ejectionsHome = Number(gameEjectionsHomeInput.value || 0);
    g.ejectionsAway = Number(gameEjectionsAwayInput.value || 0);
    g.fightOrDisruption = gameFightInput.checked;
    g.disruptionNotes = gameDisruptionNotesInput.value.trim();

    league().messages.push({id:uid('m'), time:timestamp(), type:'Score Table', text:`${teamName(g.homeTeamId)} ${g.homeScore} - ${g.awayScore} ${teamName(g.awayTeamId)} updated on ${fieldName(g.fieldId)}.`});
    if ((totalWarnings(g) || totalEjections(g)) > 0) {
      league().messages.push({id:uid('m'), time:timestamp(), type:'Conduct', text:`${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)} conduct updated. Warnings ${totalWarnings(g)}, Ejections ${totalEjections(g)}.`});
    }
    if (g.fightOrDisruption && (!previousDisruption || g.disruptionNotes)) {
      league().messages.push({id:uid('m'), time:timestamp(), type:'Conduct', text:`Fight/disruption flagged for ${teamName(g.homeTeamId)} vs ${teamName(g.awayTeamId)}${g.disruptionNotes ? ` — ${g.disruptionNotes}` : ''}.`});
    }
    saveState();
    renderAll();
    gameDialog.close();
  };
}

initTabs();
bindActions();
renderAll();
