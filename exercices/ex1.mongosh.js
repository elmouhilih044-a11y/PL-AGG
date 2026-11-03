db.loans.aggregate([
    {
        $match:{
            status: "RETURNED"
        }
},
{
   $group:{
    _id:"$memberId",
    returnedLoanCount:{$sum:1},
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
        _id: 0,
        member: "$_id",
        returnedLoanCount:1,
        revenueCents:1
       
        
}}

]).forEach(printjson)