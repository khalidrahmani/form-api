local result 		= {} 
local mapp   		= {["0"]="female", ["1"]="male", ["2"]="unisex"}
local undefined = "unknown"
local usedCredits 	= -1
local function capitalize(str)
	return string.gsub(str, "(%l)(%w*)", function(a,b) return string.upper(a)..b end)
end
for k,name in ipairs(KEYS) do
	local r 	 							= {}
	r["gender"] 						= mapp[redis.call("GET", "g:" .. name)] or undefined
	if r["gender"] ~= undefined then
		usedCredits = usedCredits + 1	
		r["validated_name"] 	= ARGV[k+2+ARGV[2]]		
	else
		if string.find(name, "-" ) ~= nil then
			local _name = name:gsub("-", "")
			r["gender"] 	  = mapp[redis.call("GET", "g:" .. _name)] or undefined
			if r["gender"] ~= undefined then
				usedCredits = usedCredits + 1	
				r["validated_name"] 	= capitalize(name)
			else
				for c in string.gmatch(name, "%w+") do			
					r["gender"] 		= mapp[redis.call("GET", "g:" .. c)] or undefined
					if r["gender"] ~= undefined then
						usedCredits = usedCredits + 1	
						r["validated_name"] = capitalize(c)
--						result[ARGV[k+2]] 	= r
						break
					end
				end
			end	
		end
	end
	result[k-1] = {["name"] = ARGV[k+2], ["data"] = r}
end
result['credits_used'] = usedCredits+1
if usedCredits ~= 0 then redis.call('INCRBY', 'r:' .. ARGV[1], usedCredits) end
return cjson.encode(result)

