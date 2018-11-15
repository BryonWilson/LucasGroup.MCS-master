using System.ComponentModel.DataAnnotations;

namespace LucasGroup.MCS.Models
{
    public class Branch
    {
        [Key]
        public int Id {get; set;}
        public string Name {get; set;}
        public string Number {get; set;}
        public string PracticeGroup {get; set;}
    }

    public static class BranchSeed
    {
        public static object[] AllBranches() => new[] {
            new {Id=1, Name="Military - Atlanta MilTech", Number="02.44.01", PracticeGroup="Military"},
            new {Id=2, Name="Military - Atlanta", Number="02.45.01", PracticeGroup="Military"},
            new {Id=3, Name="Military - Irvine", Number="02.46.01", PracticeGroup="Military"},
            new {Id=4, Name="Military - Washington DC", Number="02.48.01", PracticeGroup="Military"},
            new {Id=5, Name="Military - Dalas", Number="02.70.01", PracticeGroup="Military"},
            new {Id=6, Name="Information Technology - Tampa", Number="07.61.01", PracticeGroup="Information Technology"},
            new {Id=7, Name="Information Technology - San Diego", Number="07.67.01", PracticeGroup="Information Technology"},
            new {Id=8, Name="Information Technology - Houston", Number="07.95.01", PracticeGroup="Information Technology"},
        };
    }
}