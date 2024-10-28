def test(nums,tar):
    hash_map = {}
    for i ,n in enumerate(nums):
        if n in hash_map:
            return [hash_map[n],i]
        hash_map[tar-n] = i
    return []

print(test([2,7,11,15],26)) # [0,1]