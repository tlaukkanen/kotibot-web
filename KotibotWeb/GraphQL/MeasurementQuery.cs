using System;
using GraphQL.Types;
using KotibotWeb.Model;

namespace KotibotWeb.GraphQL
{

    public class MeasurementQuery : ObjectGraphType
    {
        public MeasurementQuery()
        {
            Field<MeasurementType>(
                "measurement",
                resolve: context => new Measurement { Id = 1, DateUpdated = DateTime.Now }
            );
        }
    }
    
}