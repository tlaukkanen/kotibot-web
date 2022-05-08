using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace KotibotWeb.Model
{
    public class Measurement
    {
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity), Key()]
        [JsonIgnore]
        public long Id { get; set; }
        
        public string Location { get; set; }
        public float Temperature { get; set; }
        public float Humidity { get; set; }
        public float Pressure { get; set; }
        public DateTimeOffset DateUpdated { get; set; } = DateTimeOffset.UtcNow;       
    }    
}
