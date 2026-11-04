db.loans.aggregate([
    {
        $match:{
            status:"RETURNED"
        }
        
    },
    {
        $lookup:{
            from:"equipments",
            localField:"equipmentId",
            foreignField:"_id",
            pipeline:[{
                $match:{
                    archived: false
                }
            },
                
            ],
            as:"result"

        }

    },
    {
        $unwind:"$result"
    },
    {
        $group:{
            _id:"$result.category",
              loanCount:{$sum:1},
            averageDurationDays:{$avg:"$durationDays"},
            revenueCents:{$sum:"$feeCents"}

        }
        
    },
    {
        $sort:{
           revenueCents:-1,
           _id:1 
        }
    },
    {
        $project:{
            category:"$_id",
            _id:0,
            averageDurationDays:{$round:["$averageDurationDays",2]},
            revenueCents:1,
            loanCount:1

        }
    }
]).forEach(printjson)