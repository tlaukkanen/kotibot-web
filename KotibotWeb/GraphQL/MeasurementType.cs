using GraphQL.Types;
using KotibotWeb.Model;

namespace KotibotWeb.GraphQL
{
    public class MeasurementType : ObjectGraphType<Measurement>
    {
        public MeasurementType()
        {
            Field(x => x.Id).Description("The Id of the measurement");
            Field(x => x.Location).Description("The location of measurement");
            Field(x => x.Pressure).Description("The air pressure");
            Field(x => x.Temperature).Description("The temperature in Celsius degrees");
            Field(x => x.DateUpdated).Description("The date when measurement was taken");
        }        
    }    
}

