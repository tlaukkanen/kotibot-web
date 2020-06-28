using Microsoft.EntityFrameworkCore.Migrations;

namespace KotibotWeb.Migrations
{
    public partial class AirPressure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Pressure",
                table: "Measurements",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Pressure",
                table: "Measurements");
        }
    }
}
