using System;
using System.Collections.Generic;
using System.Linq;

namespace LucasGroup.MCS.Extensions
{
    public static class CollectionExtensions
    {
        public static IEnumerable<T> Add<T>(this IEnumerable<T> collection, params T[] entries)
        {
            if (collection == null)
            {
                throw new ArgumentNullException(nameof(collection));
            }

            if (entries == null)
            {
                throw new ArgumentNullException(nameof(entries));
            }

            return collection.Concat(entries);
        }
    }
}